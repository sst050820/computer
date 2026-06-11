#!/usr/bin/env bash
# 农禾坊 — 一键启动全部服务
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG="$ROOT/logs"

mkdir -p "$LOG"

echo "=========================================="
echo "      农禾坊 · 全服务启动"
echo "=========================================="

echo "[1/4] 启动 MySQL..."
if ! docker ps --filter name=mysql-fruit --format '{{.Names}}' | grep -q mysql-fruit; then
  docker start mysql-fruit 2>/dev/null || docker run -d --name mysql-fruit \
    -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=fruit_platform \
    -p 3306:3306 mysql:8.0 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
  sleep 5
fi
echo "  MySQL 就绪"

echo "[2/4] 启动 Fabric (可选)..."
bash "$ROOT/scripts/start_fabric.sh" 2>/dev/null || echo "  Fabric 未就绪，跳过"

echo "[3/4] 启动 ABE 加密服务 (可选)..."
bash "$ROOT/scripts/start_crypto.sh" 2>/dev/null || echo "  ABE 服务未就绪，跳过"

echo "[4/4] 启动 Go 后端..."
cd "$ROOT/backend"
go build -o server .
fuser -k 8080/tcp 2>/dev/null || true
nohup ./server > "$LOG/backend.log" 2>&1 &
echo "  后端已启动"

echo ""
echo "=========================================="
echo "  农禾坊已启动！"
echo "  前端: http://localhost:8080"
echo "  日志: $LOG"
echo "=========================================="
