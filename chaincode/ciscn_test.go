package main

import (
	"testing"

	"github.com/hyperledger/fabric-chaincode-go/shimtest"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func TestCreateAndQueryFruit(t *testing.T) {
	stub := shimtest.NewMockStub("traceability", nil)
	stub.MockTransactionStart("tx1")
	defer stub.MockTransactionEnd("tx1")

	ctx := new(contractapi.TransactionContext)
	ctx.SetStub(stub)

	sc := new(SmartContract)
	err := sc.CreateFruit(ctx, "FRUIT001", "ciphertext-abc", "云南", "已上链")
	if err != nil {
		t.Fatalf("CreateFruit error: %v", err)
	}

	result, err := sc.QueryFruit(ctx, "FRUIT001")
	if err != nil {
		t.Fatalf("QueryFruit error: %v", err)
	}

	if result.Id != "FRUIT001" {
		t.Fatalf("expected Id FRUIT001, got %s", result.Id)
	}
	if result.HashOfCiphertext != "ciphertext-abc" {
		t.Fatalf("expected ciphertext match, got %s", result.HashOfCiphertext)
	}
	if result.Origin != "云南" {
		t.Fatalf("expected origin 云南, got %s", result.Origin)
	}
	if result.Status != "已上链" {
		t.Fatalf("expected status 已上链, got %s", result.Status)
	}
}

func TestQueryFruit_NotFound(t *testing.T) {
	stub := shimtest.NewMockStub("traceability", nil)
	ctx := new(contractapi.TransactionContext)
	ctx.SetStub(stub)

	sc := new(SmartContract)
	_, err := sc.QueryFruit(ctx, "NON_EXISTENT")
	if err == nil {
		t.Fatal("expected error for missing fruit record")
	}
}
