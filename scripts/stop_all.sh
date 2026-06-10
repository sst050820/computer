#!/usr/bin/env bash
# 隐农链 — 停止全部服务
echo "╔══════════════════════════════════════╗"
echo "║     隐农链 · 停止全部服务            ║"
echo "╚══════════════════════════════════════╝"

echo "[1/3] 停止 Go 后端..."
pkill -f 'prog_final' 2>/dev/null && echo "  ✓ 后端已停止" || echo "  - 后端未运行"

echo "[2/3] 停止 Java ABE 服务..."
pkill -f 'CryptoServer' 2>/dev/null && echo "  ✓ ABE已停止" || echo "  - ABE未运行"

echo "[3/3] 停止 Fabric 网络..."
FABRIC_BASE_PATH="${FABRIC_BASE_PATH:-/home/sitong/HyperledgerFabric/fabric-samples/test-network}"
if [ -f "$FABRIC_BASE_PATH/network.sh" ]; then
  cd "$FABRIC_BASE_PATH" && ./network.sh down 2>/dev/null && echo "  ✓ Fabric已停止" || echo "  - Fabric未运行"
else
  echo "  - Fabric脚本未找到"
fi

echo "✅ 全部服务已停止"
