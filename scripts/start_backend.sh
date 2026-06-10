#!/usr/bin/env bash
# 编译并启动 Go 后端服务
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG="$ROOT/logs"

mkdir -p "$LOG"

cd "$ROOT/backend"

echo "编译 Go 后端..."
go build -o /tmp/prog_final main.go
echo "✓ 编译完成"

# 停止旧进程
pkill -f 'prog_final' 2>/dev/null || true

echo "启动后端服务 (端口 8080)..."
nohup /tmp/prog_final > "$LOG/backend.log" 2>&1 &
PID=$!
echo "✓ 后端已启动 PID=$PID"
echo "  前端: http://localhost:8080"
