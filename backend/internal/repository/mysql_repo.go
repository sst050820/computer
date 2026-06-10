package repository

import "fmt"

// MySQLRepo 关系数据库交互层（预留）
type MySQLRepo struct {
	Ready bool
}

// NewMySQLRepo 初始化 MySQL 连接
func NewMySQLRepo() *MySQLRepo {
	// TODO: 实际项目接入 MySQL
	fmt.Println("[DB] MySQL 未配置，使用内存存储")
	return &MySQLRepo{Ready: false}
}
