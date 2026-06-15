package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
)

func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		// 静态文件（/js/ /css/ /public/ /index.html）禁止浏览器缓存
		// 否则修改 JS/CSS 后浏览器不刷新，必须无痕窗口才能看到新代码
		path := c.Request.URL.Path
		if c.Request.Method == "GET" && !strings.HasPrefix(path, "/api/") {
			c.Writer.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
			c.Writer.Header().Set("Pragma", "no-cache")
			c.Writer.Header().Set("Expires", "0")
		}
		c.Next()
	}
}
