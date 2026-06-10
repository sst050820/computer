#!/usr/bin/env bash
# 隐农链 — 一键启动全部服务
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG="$ROOT/logs"

mkdir -p "$LOG"

echo "╔══════════════════════════════════════╗"
echo "║     隐农链 · 全服务启动              ║"
echo "╚══════════════════════════════════════╝"

echo "[1/3] 启动 Fabric 区块链网络..."
bash "$ROOT/scripts/start_fabric.sh" || echo "  ⚠️ Fabric 未就绪，使用本地模式"

echo "[2/3] 启动 Java ABE 加密服务..."
bash "$ROOT/scripts/start_crypto.sh" || echo "  ⚠️ ABE 服务未就绪，使用本地模式"

echo "[3/3] 启动 Go 后端服务..."
bash "$ROOT/scripts/start_backend.sh"

echo ""
echo "╔══════════════════════════════════════╗"
echo "║  🚀 隐农链已启动                     ║"
echo "║  前端: http://localhost:8080          ║"
echo "║  ABE:  http://localhost:8081          ║"
echo "║  日志: $LOG                           ║"
echo "╚══════════════════════════════════════╝"
