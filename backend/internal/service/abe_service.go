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

// SubmitToFabric 提交到区块链
func SubmitToFabric(id, ciphertext, location string) {
	// 实际调用 Fabric contract.SubmitTransaction
	fmt.Printf("[Fabric] 提交: %s -> %s\n", id, location)
}
