package handler

import (
	"encoding/json"
	"fmt"

	"datafield/model"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// InitLedger 初始化账本种子数据
func InitLedger(ctx contractapi.TransactionContextInterface) error {
	records := []model.DataField{
		{
			ID:               "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
			HashOfMessage:    "1f8a6d9d939b71e0196ff3107b360f07481ce24f127503c9e55d40562d7a9e47",
			HashOfCiphertext: "d8007a655e5cd500a6a6c5a6bc13154bb904bcb1e9dceae06ac8287fe9fe505a",
			AccessPolicy:     "(Age=42, Seat=4, Type=1; 3)",
		},
	}
	for _, r := range records {
		bytes, err := json.Marshal(r)
		if err != nil {
			return fmt.Errorf("marshal init data error: %v", err)
		}
		if err := ctx.GetStub().PutState(r.ID, bytes); err != nil {
			return err
		}
	}
	return nil
}
