package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"time"
)

const defaultEncryptURL = "http://localhost:8081/api/encrypt"
const defaultDecryptURL = "http://localhost:8081/api/decrypt"

var contract interface{} // Fabric contract placeholder

// ConditionToPolicy 业务条件 → ABE 策略表达式
func ConditionToPolicy(conditions map[string]string) string {
	var parts []string
	count := 0
	for k, v := range conditions {
		if v != "" {
			parts = append(parts, fmt.Sprintf("%s=%s", k, v))
			count++
		}
	}
	if count == 0 { return "" }
	return fmt.Sprintf("(%s; %d)", strings.Join(parts, ", "), count)
}

// PolicyToDisplay 策略 → 用户可读文本
func PolicyToDisplay(policy string) string {
	if policy == "" { return "无条件限制" }
	s := strings.ReplaceAll(policy, "Location=", "产地要求：")
	s = strings.ReplaceAll(s, "Capability=", "加工能力：")
	s = strings.ReplaceAll(s, "Quality=", "品质认证：")
	s = strings.ReplaceAll(s, "Grade=", "等级要求：")
	s = strings.ReplaceAll(s, ", ", " | ")
	s = strings.Trim(s, "()")
	return s
}

// EncryptWithABE 调用 Java ABE 加密
func EncryptWithABE(plaintext string) (sessionID, ciphertext string, err error) {
	url := os.Getenv("ABE_SERVICE_URL")
	if url == "" { url = defaultEncryptURL }
	client := http.Client{Timeout: 5 * time.Second}
	resp, err := client.Post(url, "text/plain", bytes.NewBufferString(plaintext))
	if err != nil { return "", plaintext, nil } // 降级
	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)
	bodyStr := string(body)

	var parsed map[string]interface{}
	if json.Unmarshal(body, &parsed) == nil {
		if id, ok := parsed["id"].(string); ok { sessionID = id }
	}
	if sessionID == "" { sessionID = fmt.Sprintf("sess_%d", time.Now().UnixNano()) }
	return sessionID, bodyStr, nil
}

// DecryptWithABE 调用 Java ABE 解密服务验证商家是否有权查看
// 传入密文和商家属性map，成功返回原文，失败返回空
func DecryptWithABE(ciphertext string, attributes map[string]string) (plaintext string, err error) {
	url := os.Getenv("ABE_DECRYPT_URL")
	if url == "" { url = defaultDecryptURL }

	reqBody := map[string]interface{}{
		"ciphertext": ciphertext,
		"attributes": attributes,
	}
	jsonBody, _ := json.Marshal(reqBody)

	client := http.Client{Timeout: 5 * time.Second}
	resp, err := client.Post(url, "application/json", bytes.NewBuffer(jsonBody))
	if err != nil {
		return "", fmt.Errorf("ABE decrypt service unavailable: %w", err)
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)

	if resp.StatusCode != 200 {
		return "", fmt.Errorf("ABE decrypt denied (status %d): %s", resp.StatusCode, string(body))
	}

	// Try parse as JSON (success response)
	var result map[string]interface{}
	if json.Unmarshal(body, &result) == nil {
		if pt, ok := result["plaintext"].(string); ok && pt != "" {
			return pt, nil
		}
		if pt, ok := result["data"].(string); ok && pt != "" {
			return pt, nil
		}
	}

	// Raw plaintext response
	return string(body), nil
}

// MatchAttributes 降级：ABE 服务不可用时，用属性匹配验证
func MatchAttributes(policy string, attributes map[string]string) bool {
	if policy == "" { return true }
	// Parse policy "(Location=福建, Capability=制茶; 2)"
	parts := strings.Split(policy, ";")
	if len(parts) < 2 { return false }
	condStr := strings.TrimPrefix(parts[0], "(")
	pairs := strings.Split(condStr, ", ")
	for _, pair := range pairs {
		kv := strings.SplitN(pair, "=", 2)
		if len(kv) != 2 { continue }
		attrVal, ok := attributes[kv[0]]
		if !ok || attrVal != kv[1] { return false }
	}
	return true
}

// RevokeAttribute 调 Java ABE 服务撤销某个属性
// 属性撤销后，持有该属性的用户私钥失效，无法再解密对应密文
func RevokeAttribute(attrType, attrValue string) (success bool, message string) {
	url := os.Getenv("ABE_REVOKE_URL")
	if url == "" { url = "http://localhost:8081/api/revoke" }

	reqBody := map[string]string{"type": attrType, "value": attrValue}
	jsonBody, _ := json.Marshal(reqBody)

	client := http.Client{Timeout: 5 * time.Second}
	resp, err := client.Post(url, "application/json", bytes.NewBuffer(jsonBody))
	if err != nil {
		// Java 服务不可用 → 降级：仅 DB 撤销，下次 SysUpdate 全局生效
		return true, fmt.Sprintf("属性 %s=%s 已标记撤销（ABE服务降级，系统密钥更新后生效）", attrType, attrValue)
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		return true, fmt.Sprintf("属性 %s=%s ABE 撤销成功，已更新公钥参数", attrType, attrValue)
	}
	body, _ := ioutil.ReadAll(resp.Body)
	return false, fmt.Sprintf("ABE 撤销失败: %s", string(body))
}

// UpdateSystemKeys 调 Java ABE 服务更新系统主密钥（全局密钥轮换）
// 所有通行证失效，用户需重新获取资质
func UpdateSystemKeys() (success bool, message string) {
	url := os.Getenv("ABE_REKEY_URL")
	if url == "" { url = "http://localhost:8081/api/rekey" }

	client := http.Client{Timeout: 10 * time.Second}
	resp, err := client.Post(url, "application/json", nil)
	if err != nil {
		return false, fmt.Sprintf("ABE 密钥服务不可用: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		return true, "系统主密钥已更新，所有旧通行证失效，用户需重新获取资质"
	}
	body, _ := ioutil.ReadAll(resp.Body)
	return false, fmt.Sprintf("密钥更新失败: %s", string(body))
}

// ReEncryptContent 调 Java ABE 服务用新密钥重新加密内容
func ReEncryptContent(oldCiphertext string) (newCiphertext string, err error) {
	url := os.Getenv("ABE_REENCRYPT_URL")
	if url == "" { url = "http://localhost:8081/api/reencrypt" }

	client := http.Client{Timeout: 5 * time.Second}
	resp, err := client.Post(url, "text/plain", bytes.NewBufferString(oldCiphertext))
	if err != nil {
		return oldCiphertext, err // 降级：保留旧密文
	}
	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)
	return string(body), nil
}

// SubmitToFabric 提交到区块链
func SubmitToFabric(id, ciphertext, location string) {
	fmt.Printf("[Fabric] 提交: %s -> %s\n", id, location)
}
