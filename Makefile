.PHONY: all start stop clean db backend frontend crypto

all: start

start:
	bash scripts/start_all.sh

stop:
	bash scripts/stop_all.sh

db:
	@docker start mysql-fruit 2>/dev/null || docker run -d --name mysql-fruit \
		-e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=fruit_platform \
		-p 3306:3306 mysql:8.0 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
	@echo "MySQL started (root:123456, db:fruit_platform)"

backend:
	cd backend && go build -o server . && fuser -k 8080/tcp 2>/dev/null || true; nohup ./server > ../logs/backend.log 2>&1 &
	@echo "Backend: http://localhost:8080"

frontend:
	@echo "Frontend served by Go backend, no separate start needed"
	@echo "Visit: http://localhost:8080"

fabric:
	bash scripts/start_fabric.sh

crypto:
	bash scripts/start_crypto.sh

clean:
	fuser -k 8080/tcp 2>/dev/null || true
	fuser -k 8081/tcp 2>/dev/null || true
	rm -f backend/server
	rm -f logs/*.log
	@echo "Cleaned"
