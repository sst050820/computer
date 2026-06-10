#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FABRIC_BASE_PATH="${FABRIC_BASE_PATH:-/home/sitong/HyperledgerFabric/fabric-samples/test-network}"
CC_NAME="${CHAINCODE_NAME:-traceability}"
CC_PATH="$ROOT/chaincode"
BACKEND_PATH="$ROOT/backend"
JAVA_PATH="$ROOT/crypto_service"
LOG_DIR="$ROOT/logs"

mkdir -p "$LOG_DIR"

function info() {
  printf "[INFO] %s\n" "$*"
}

function warn() {
  printf "[WARN] %s\n" "$*"
}

function err() {
  printf "[ERROR] %s\n" "$*" >&2
}

function wait_port() {
  local port=$1
  local timeout=${2:-30}
  local start=$(date +%s)
  while true; do
    if bash -c "</dev/tcp/127.0.0.1/$port" >/dev/null 2>&1; then
      return 0
    fi
    if (( $(date +%s) - start >= timeout )); then
      return 1
    fi
    sleep 1
  done
}

info "项目根目录：$ROOT"
info "Fabric network 目录：$FABRIC_BASE_PATH"

if [ ! -f "$FABRIC_BASE_PATH/network.sh" ]; then
  err "找不到 Fabric network.sh: $FABRIC_BASE_PATH/network.sh"
  err "请确认 FABRIC_BASE_PATH 是否正确，或设置环境变量 FABRIC_BASE_PATH。"
  exit 1
fi

cd "$FABRIC_BASE_PATH"
info "检查 Fabric 网络状态..."
if docker ps --format '{{.Names}}' | grep -q 'peer0.org1.example.com'; then
  info "Fabric 网络已检测到 peer0.org1.example.com 节点，跳过 network up。"
else
  info "启动 Fabric 网络并创建通道..."
  ./network.sh up createChannel -ca
fi

info "部署链码到 Fabric 网络..."
./network.sh deployCC -ccn "$CC_NAME" -ccp "$CC_PATH" -ccl go

JAVA_PID=""
if command -v javac >/dev/null 2>&1 && command -v java >/dev/null 2>&1; then
  info "检测到 Java，可尝试启动 ABE 加密服务。"
  cd "$JAVA_PATH"
  mkdir -p classes
  info "编译 Java ABE 服务源码..."
  javac -cp "lib/*" -d classes CryptoServer.java java/compositeOrderPairingGroups.java java/MAFASACAR/*.java java/PublicStructure/*.java java/utils/*.java
  info "启动 Java ABE 服务 (8081)..."
  nohup java -cp "classes:lib/*" CryptoServer > "$LOG_DIR/java.log" 2>&1 &
  JAVA_PID=$!
  if wait_port 8081 30; then
    info "Java ABE 服务已启动，监听端口 8081。"
  else
    warn "Java ABE 服务未能在 30 秒内启动，请检查 $LOG_DIR/java.log。"
  fi
else
  warn "未检测到 javac/java，跳过 ABE 服务启动。"
  warn "如需完整功能，请安装 Java 并重新运行脚本。"
  warn "Debian/Ubuntu 系统可执行：sudo apt update && sudo apt install -y openjdk-17-jdk"
fi

info "启动 Go 后端服务 (8080)..."
cd "$BACKEND_PATH"
nohup env FABRIC_BASE_PATH="$FABRIC_BASE_PATH" go run ciscn.go > "$LOG_DIR/backend.log" 2>&1 &
BACKEND_PID=$!

if wait_port 8080 30; then
  info "Go 后端服务已启动，监听端口 8080。"
else
  warn "Go 后端服务未能在 30 秒内启动，请检查 $LOG_DIR/backend.log。"
fi

info "如果浏览器可用，尝试打开 http://localhost:8080"
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open http://localhost:8080 >/dev/null 2>&1 || true
elif command -v sensible-browser >/dev/null 2>&1; then
  sensible-browser http://localhost:8080 >/dev/null 2>&1 || true
else
  warn "未找到浏览器打开命令，请手动访问 http://localhost:8080"
fi

printf "\n运行完成。\n"
printf "Fabric network: $FABRIC_BASE_PATH\n"
printf "Backend log: $LOG_DIR/backend.log\n"
printf "Java log: $LOG_DIR/java.log\n"
printf "后端 PID: %s\n" "${BACKEND_PID:-}" 
if [ -n "$JAVA_PID" ]; then
  printf "Java PID: %s\n" "$JAVA_PID"
fi
printf "打开浏览器地址：http://localhost:8080\n"
printf "如果需要停止后端，请使用 kill %s\n" "${BACKEND_PID:-}"
