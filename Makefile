.PHONY: all start stop clean

all: start

start:
	bash scripts/start_all.sh

stop:
	bash scripts/stop_all.sh

fabric:
	bash scripts/start_fabric.sh

crypto:
	bash scripts/start_crypto.sh

backend:
	bash scripts/start_backend.sh

clean:
	pkill -f 'go run main.go' 2>/dev/null || true
	pkill -f 'CryptoServer' 2>/dev/null || true
	rm -rf crypto_service/classes/
	rm -f logs/*.log
