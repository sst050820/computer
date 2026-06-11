package handler

import (
	"fmt"
	"strings"

	"fruit_backend/internal/model"
	"fruit_backend/internal/repository"

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
		u, err := repository.GetUserByUsername(req.Username)
		if err != nil {
			c.JSON(500, gin.H{"error": "服务器错误"})
			return
		}
		if u == nil {
			// 尝试按显示名称查找
			users, _ := repository.GetAllUsers()
			for _, user := range users {
				if user.Name == req.Username && user.Password == req.Password {
					c.JSON(200, gin.H{
						"status": "success", "user": user,
						"token": fmt.Sprintf("token_%s_%s", user.Role, user.ID),
					})
					return
				}
			}
			c.JSON(401, gin.H{"error": "用户名或密码错误"})
			return
		}
		if u.Password != req.Password {
			c.JSON(401, gin.H{"error": "用户名或密码错误"})
			return
		}
		c.JSON(200, gin.H{
			"status": "success", "user": u,
			"token": fmt.Sprintf("token_%s_%s", u.Role, u.ID),
		})
		return
	}

	// 降级：仅按角色登录（向后兼容）
	users, _ := repository.GetAllUsers()
	for _, u := range users {
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
	existing, _ := repository.GetUserByUsername(req.Username)
	if existing != nil {
		c.JSON(409, gin.H{"error": "用户名已存在"})
		return
	}

	if req.Role == "" {
		req.Role = "consumer"
	}

	// 生成 ID
	allUsers, _ := repository.GetAllUsers()
	id := fmt.Sprintf("%s%02d", req.Role[:1], len(allUsers)+1)

	user := &model.User{
		ID: id, Username: req.Username, Password: req.Password,
		Name: req.Name, Role: req.Role, Phone: req.Phone, Location: req.Location,
	}

	if err := repository.CreateUser(user); err != nil {
		c.JSON(500, gin.H{"error": "注册失败: " + err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"status":  "success",
		"user":    user,
		"token":   fmt.Sprintf("token_%s_%s", user.Role, user.ID),
		"message": "注册成功",
	})
}

func HandleUpdateUserProfile(c *gin.Context) {
	var req struct {
		UserID   string `json:"user_id"`
		Name     string `json:"name"`
		Phone    string `json:"phone"`
		Location string `json:"location"`
	}
	if err := c.ShouldBindJSON(&req); err != nil { c.JSON(400, gin.H{"error":"参数错误"}); return }
	if err := repository.UpdateUserProfile(req.UserID, req.Name, req.Phone, req.Location); err != nil {
		c.JSON(500, gin.H{"error": err.Error()}); return
	}
	c.JSON(200, gin.H{"status":"success","message":"信息已更新"})
}

var _ = strings.EqualFold
