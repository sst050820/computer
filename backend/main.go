package main

import (
	"fmt"
	"log"
	"os"

	"fruit_backend/internal/repository"
	"fruit_backend/internal/router"
)

func main() {
	// 初始化数据库（密码通过环境变量 DB_PASSWORD 传入，默认开发密码）
	dbPassword := os.Getenv("DB_PASSWORD")
	if dbPassword == "" {
		dbPassword = "123456" // 开发环境默认
	}
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "127.0.0.1"
	}
	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "3306"
	}
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "fruit_platform"
	}
	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "root"
	}
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=true",
		dbUser, dbPassword, dbHost, dbPort, dbName)
	if err := repository.InitDB(dsn); err != nil {
		log.Fatalf("[FATAL] MySQL 连接失败: %v", err)
	}

	// 导入种子数据
	repository.SeedDemoData()
	repository.PrintStats()

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
