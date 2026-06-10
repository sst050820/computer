#!/usr/bin/env bash
# 启动 Hyperledger Fabric 测试网络并部署链码
set -euo pipefail

FB="${FABRIC_BASE_PATH:-/home/sitong/HyperledgerFabric/fabric-samples/test-network}"
CC="${CHAINCODE_NAME:-traceability}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ ! -f "$FB/network.sh" ]; then
  echo "❌ 找不到 Fabric network.sh: $FB"
  echo "请设置 FABRIC_BASE_PATH 环境变量"
  exit 1
fi

cd "$FB"

# 启动网络
if docker ps --format '{{.Names}}' 2>/dev/null | grep -q 'peer0.org1.example.com'; then
  echo "✓ Fabric 网络已在运行"
else
  echo "正在启动 Fabric 网络..."
  ./network.sh up createChannel -ca
  echo "✓ 网络已启动"
fi

# 部署链码
echo "正在部署链码 $CC ..."
./network.sh deployCC -ccn "$CC" -ccp "$ROOT/chaincode" -ccl go
echo "✓ 链码已部署"
