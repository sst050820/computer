#!/usr/bin/env bash
# 农禾坊 — 全服务部署脚本
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$ROOT/logs"

mkdir -p "$LOG_DIR"

info()  { printf "  [INFO] %s\n" "$*"; }
warn()  { printf "  [WARN] %s\n" "$*"; }

echo "=========================================="
echo "   农禾坊 · 全服务部署"
echo "=========================================="

# ---- 1. MySQL ----
echo "[1/4] MySQL (Docker)"
if docker ps --filter name=mysql-fruit --format '{{.Names}}' | grep -q mysql-fruit; then
  info "MySQL 已运行"
else
  docker start mysql-fruit 2>/dev/null || docker run -d --name mysql-fruit \
    -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=fruit_platform \
    -p 3306:3306 mysql:8.0 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
  info "等待 MySQL 就绪..."
  sleep 5
fi

# ---- 2. Java ABE ----
echo "[2/4] Java ABE 密码学服务 (:8081)"
cd "$ROOT/crypto_service"
if command -v java >/dev/null 2>&1; then
  fuser -k 8081/tcp 2>/dev/null || true
  mkdir -p classes
  javac -cp "lib/*:classes" -d classes CryptoServer.java && info "编译成功" || warn "编译失败"
  nohup java -cp "lib/*:classes" CryptoServer > "$LOG_DIR/abe.log" 2>&1 &
  info "ABE 服务已启动（加密/解密/撤销/轮换/重加密）"
else
  warn "未找到 Java，跳过 ABE（加密将降级为明文）"
fi

# ---- 3. Fabric (可选) ----
echo "[3/4] Hyperledger Fabric (可选)"
if [ -f "$ROOT/scripts/start_fabric.sh" ]; then
  bash "$ROOT/scripts/start_fabric.sh" 2>/dev/null && info "Fabric 已连接" || warn "Fabric 未就绪，跳过"
fi

# ---- 4. Go 后端 ----
echo "[4/4] Go 后端 (:8080)"
cd "$ROOT/backend"
go build -o server . && info "编译成功"
fuser -k 8080/tcp 2>/dev/null || true
FRONTEND_ROOT="$ROOT/frontend" nohup ./server > "$LOG_DIR/backend.log" 2>&1 &
info "后端已启动: http://localhost:8080"

echo ""
echo "=========================================="
echo "  启动完成！访问 http://localhost:8080"
echo "  日志: $LOG_DIR"
echo "=========================================="
