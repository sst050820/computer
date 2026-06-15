#!/usr/bin/env bash
# 农禾坊 — 停止全部服务
echo "=========================================="
echo "      农禾坊 · 停止全部服务"
echo "=========================================="

echo "[1/4] 停止 Go 后端..."
fuser -k 8080/tcp 2>/dev/null && echo "  ✓ 后端已停止 (8080)" || echo "  - 后端未运行"

echo "[2/4] 停止 Java ABE 密码学服务..."
fuser -k 8081/tcp 2>/dev/null && echo "  ✓ ABE 已停止 (8081)" || echo "  - ABE 未运行"

echo "[3/4] 停止 Fabric 网络..."
FABRIC_BASE_PATH="${FABRIC_BASE_PATH:-/home/sitong/HyperledgerFabric/fabric-samples/test-network}"
if [ -f "$FABRIC_BASE_PATH/network.sh" ]; then
  cd "$FABRIC_BASE_PATH" && ./network.sh down 2>/dev/null && echo "  ✓ Fabric已停止" || echo "  - Fabric未运行"
else
  echo "  - Fabric脚本未找到，跳过"
fi

echo "[4/4] MySQL 保持运行（docker stop mysql-fruit 手动停止）"
echo "  docker stop mysql-fruit   # 如需停止"

echo "=========================================="
echo "  ✅ 全部服务已停止"
echo "=========================================="
