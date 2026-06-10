package handler

import (
	"encoding/json"
	"fmt"

	"datafield/model"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// CreateFruit 创建果蔬追溯记录
func CreateFruit(ctx contractapi.TransactionContextInterface, id, ciphertext, origin, status string) error {
	data := model.DataField{
		ID:               id,
		HashOfCiphertext: ciphertext,
		Origin:           origin,
		Status:           status,
	}
	bytes, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("marshal error: %v", err)
	}
	return ctx.GetStub().PutState(id, bytes)
}

// QueryFruit 查询果蔬追溯记录
func QueryFruit(ctx contractapi.TransactionContextInterface, id string) (*model.DataField, error) {
	bytes, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("get state error: %v", err)
	}
	if bytes == nil {
		return nil, fmt.Errorf("record %s not found", id)
	}
	var data model.DataField
	if err := json.Unmarshal(bytes, &data); err != nil {
		return nil, fmt.Errorf("unmarshal error: %v", err)
	}
	return &data, nil
}
