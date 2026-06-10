package main

import (
	"fmt"
	"os"

	"fruit_backend/internal/model"
	"fruit_backend/internal/router"
)

func main() {
	// 初始化种子数据
	model.SeedData()

	// 尝试连接 Fabric（非阻塞）
	router.InitFabric()

	// 启动 HTTP 服务
	r := router.Setup()
	port := os.Getenv("BACKEND_PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Println("[OK] 隐农链服务已启动: http://localhost:" + port)
	r.Run(":" + port)
}
