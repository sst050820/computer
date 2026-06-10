#!/usr/bin/env bash
# 编译并启动 Go 后端服务（含 MySQL）
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG="$ROOT/logs"

mkdir -p "$LOG"

# 启动 MySQL（如果未运行）
if ! docker ps --filter name=mysql-fruit --format '{{.Names}}' | grep -q mysql-fruit; then
  echo "启动 MySQL..."
  docker start mysql-fruit 2>/dev/null || docker run -d --name mysql-fruit \
    -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=fruit_platform \
    -p 3306:3306 mysql:8.0 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
  echo "等待 MySQL 就绪..."
  sleep 5
fi

cd "$ROOT/backend"

echo "编译 Go 后端..."
go build -o server .
echo "编译完成"

# 停止旧进程
fuser -k 8080/tcp 2>/dev/null || true

echo "启动后端服务 (端口 8080)..."
nohup ./server > "$LOG/backend.log" 2>&1 &
PID=$!
echo "后端已启动 PID=$PID"
echo "前端: http://localhost:8080"
