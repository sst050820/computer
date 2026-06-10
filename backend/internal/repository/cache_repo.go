package repository

import "fmt"

// CacheRepo Redis 缓存层（预留）
type CacheRepo struct {
	Ready bool
}

// NewCacheRepo 初始化 Redis 连接
func NewCacheRepo() *CacheRepo {
	fmt.Println("[Cache] Redis 未配置，跳过缓存")
	return &CacheRepo{Ready: false}
}
