#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

printf "\n== ciscn 一键测试脚本 ==\n"

printf "\n-- backend 模块测试 --\n"
cd "$ROOT/backend"
if go test ./...; then
  printf "backend: go test 成功\n"
else
  printf "backend: go test 失败\n"
  exit 1
fi

printf "\n-- chaincode 模块测试 --\n"
cd "$ROOT/chaincode"
if GOFLAGS=-mod=mod go test ./...; then
  printf "chaincode: go test 成功\n"
else
  printf "chaincode: go test 失败\n"
  exit 1
fi

printf "\n-- frontend 简单交互与 API 测试 --\n"
cd "$ROOT/frontend"
if ./test_frontend.sh; then
  printf "frontend: test passed\n"
else
  printf "frontend: test failed\n"
  exit 1
fi

printf "\n== 全部测试完成 ==\n"
