package repository

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"

	"github.com/hyperledger/fabric-sdk-go/pkg/core/config"
	"github.com/hyperledger/fabric-sdk-go/pkg/gateway"
)

// FabricRepo Fabric 区块链交互层
type FabricRepo struct {
	Contract *gateway.Contract
	Ready    bool
}

// NewFabricRepo 初始化 Fabric 连接
func NewFabricRepo() *FabricRepo {
	repo := &FabricRepo{}
	base := getEnv("FABRIC_BASE_PATH", "/home/sitong/HyperledgerFabric/fabric-samples/test-network")
	ccpPath := filepath.Join(base, "organizations", "peerOrganizations", "org1.example.com", "connection-org1.yaml")
	credPath := filepath.Join(base, "organizations", "peerOrganizations", "org1.example.com", "users", "User1@org1.example.com", "msp")
	certPath := filepath.Join(credPath, "signcerts", "User1@org1.example.com-cert.pem")
	keyDir := filepath.Join(credPath, "keystore")

	files, err := ioutil.ReadDir(keyDir)
	if err != nil || len(files) == 0 {
		fmt.Printf("[Fabric] 未连接: %v\n", err)
		return repo
	}

	certBytes, _ := ioutil.ReadFile(certPath)
	keyBytes, _ := ioutil.ReadFile(filepath.Join(keyDir, files[0].Name()))

	wallet := gateway.NewInMemoryWallet()
	identity := gateway.NewX509Identity("Org1MSP", string(certBytes), string(keyBytes))
	if err = wallet.Put("appUser", identity); err != nil {
		return repo
	}

	gw, err := gateway.Connect(
		gateway.WithConfig(config.FromFile(filepath.Clean(ccpPath))),
		gateway.WithIdentity(wallet, "appUser"),
	)
	if err != nil {
		return repo
	}

	network, err := gw.GetNetwork("mychannel")
	if err != nil {
		return repo
	}

	repo.Contract = network.GetContract("traceability")
	repo.Ready = true
	fmt.Println("[Fabric] 已连接")
	return repo
}

// Submit 提交交易到账本
func (r *FabricRepo) Submit(fn string, args ...string) ([]byte, error) {
	if !r.Ready {
		return nil, fmt.Errorf("fabric not ready")
	}
	return r.Contract.SubmitTransaction(fn, args...)
}

// Evaluate 查询账本
func (r *FabricRepo) Evaluate(fn string, args ...string) ([]byte, error) {
	if !r.Ready {
		return nil, fmt.Errorf("fabric not ready")
	}
	return r.Contract.EvaluateTransaction(fn, args...)
}

// QueryAsJSON 查询并解析为 JSON
func (r *FabricRepo) QueryAsJSON(fn string, args ...string) (map[string]interface{}, error) {
	bytes, err := r.Evaluate(fn, args...)
	if err != nil {
		return nil, err
	}
	var result map[string]interface{}
	if err := json.Unmarshal(bytes, &result); err != nil {
		return nil, err
	}
	return result, nil
}

func getEnv(k, fb string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return fb
}
