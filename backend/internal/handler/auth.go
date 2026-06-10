package handler

import (
	"fmt"
	"strings"

	"fruit_backend/internal/model"

	"github.com/gin-gonic/gin"
)

// HandleLogin 用户登录
func HandleLogin(c *gin.Context) {
	var req model.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "参数错误"})
		return
	}

	// 优先用用户名+密码匹配
	if req.Username != "" {
		for _, u := range model.Users {
			if (u.Username == req.Username || u.Name == req.Username) && u.Password == req.Password {
				c.JSON(200, gin.H{
					"status": "success", "user": u,
					"token": fmt.Sprintf("token_%s_%s", u.Role, u.ID),
				})
				return
			}
		}
		c.JSON(401, gin.H{"error": "用户名或密码错误"})
		return
	}

	// 降级：仅按角色登录（向后兼容）
	for _, u := range model.Users {
		if u.Role == req.Role {
			c.JSON(200, gin.H{
				"status": "success", "user": u,
				"token": fmt.Sprintf("token_%s_%s", u.Role, u.ID),
			})
			return
		}
	}
	c.JSON(404, gin.H{"error": "未找到匹配用户"})
}

// HandleRegister 用户注册
func HandleRegister(c *gin.Context) {
	var req model.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "参数错误"})
		return
	}
	if req.Username == "" || req.Password == "" || req.Name == "" {
		c.JSON(400, gin.H{"error": "用户名、密码、姓名为必填"})
		return
	}

	// 检查用户名唯一性
	for _, u := range model.Users {
		if strings.EqualFold(u.Username, req.Username) {
			c.JSON(409, gin.H{"error": "用户名已存在"})
			return
		}
	}

	if req.Role == "" { req.Role = "consumer" }
	id := fmt.Sprintf("%s%02d", req.Role[:1], len(model.Users)+1)
	user := &model.User{
		ID: id, Username: req.Username, Password: req.Password,
		Name: req.Name, Role: req.Role, Phone: req.Phone, Location: req.Location,
	}
	model.Users[id] = user

	c.JSON(200, gin.H{
		"status": "success", "user": user,
		"token":  fmt.Sprintf("token_%s_%s", user.Role, user.ID),
		"message": "注册成功",
	})
}
