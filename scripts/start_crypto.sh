#!/usr/bin/env bash
# 编译并启动 Java ABE 加密服务
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

# 编译
echo "编译 ABE 服务源码..."
javac -cp "lib/*" -d classes \
  CryptoServer.java \
  java/compositeOrderPairingGroups.java \
  java/MAFASACAR/*.java \
  java/PublicStructure/*.java \
  java/utils/*.java
echo "✓ 编译完成"

# 启动
echo "启动 ABE 服务 (端口 8081)..."
nohup java -cp "classes:lib/*" CryptoServer > "$LOG/java.log" 2>&1 &
PID=$!
echo "✓ ABE 服务已启动 PID=$PID"
echo "  API: http://localhost:8081/api/encrypt"
