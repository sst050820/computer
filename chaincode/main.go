package main

import (
	"encoding/json"
	"fmt"

	"datafield/model"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

func (s *SmartContract) Init(ctx contractapi.TransactionContextInterface) error {
	data := []model.DataField{
		{
			Id:               "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
			HashOfMessage:    "1f8a6d9d939b71e0196ff3107b360f07481ce24f127503c9e55d40562d7a9e47",
			HashOfCiphertext: "d8007a655e5cd500a6a6c5a6bc13154bb904bcb1e9dceae06ac8287fe9fe505a",
			AccessPolicy:     "(Age=42, Seat=4, Type=1; 3)",
		},
	}
	for _, d := range data {
		dataOfBytes, err := json.Marshal(d)
		if err != nil {
			fmt.Printf("Error Init dataField chaincode: %s", err.Error())
		}
		ctx.GetStub().PutState(d.Id, dataOfBytes)
	}

	return nil
}

func (s *SmartContract) CreateFruit(ctx contractapi.TransactionContextInterface, id string, ciphertext string, origin string, status string) error {
	data := model.DataField{
		Id:               id,
		HashOfCiphertext: ciphertext,
		Origin:           origin,
		Status:           status,
	}
	dataOfBytes, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("Error marshal fruit data: %s", err.Error())
	}
	return ctx.GetStub().PutState(id, dataOfBytes)
}

func (s *SmartContract) QueryFruit(ctx contractapi.TransactionContextInterface, id string) (*model.DataField, error) {
	data := &model.DataField{}
	dataOfBytes, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("Error get fruit data: %s", err.Error())
	}
	if dataOfBytes == nil {
		return nil, fmt.Errorf("Fruit %s does not exist", id)
	}
	err = json.Unmarshal(dataOfBytes, data)
	if err != nil {
		return nil, fmt.Errorf("Error unmarshal fruit data: %s", err.Error())
	}
	return data, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(SmartContract))
	if err != nil {
		fmt.Printf("Error create rsu chaincode: %s", err.Error())
		return
	}
	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting rsu chaincode: %s", err.Error())
	}
}
