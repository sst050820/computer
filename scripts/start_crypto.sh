#!/usr/bin/env bash
# 编译并启动 Java ABE 密码学服务
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG="$ROOT/logs"

mkdir -p "$LOG" "$ROOT/crypto_service/classes"

cd "$ROOT/crypto_service"

# 检查 Java
if ! command -v javac &>/dev/null || ! command -v java &>/dev/null; then
  echo "❌ 未找到 javac/java，请安装 JDK 17+"
  echo "   sudo apt install -y openjdk-17-jdk"
  exit 1
fi

# 杀掉旧进程
fuser -k 8081/tcp 2>/dev/null || true

# 编译
echo "编译 ABE 密码学服务..."
javac -cp "lib/*:classes" -d classes CryptoServer.java
echo "✓ 编译完成"

# 启动
echo "启动 ABE 服务 (端口 8081)..."
nohup java -cp "lib/*:classes" CryptoServer > "$LOG/abe.log" 2>&1 &
echo "✓ ABE 服务已启动"
echo "  端点: /api/encrypt | /api/decrypt | /api/revoke | /api/rekey | /api/reencrypt"
