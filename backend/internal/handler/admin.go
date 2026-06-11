package handler

import (
	"fruit_backend/internal/repository"
	"fruit_backend/internal/service"

	"github.com/gin-gonic/gin"
)

func HandleGetAllUsers(c *gin.Context) {
	users, err := repository.GetAllUsers()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "success", "data": users})
}

func HandleGetAllQualifications(c *gin.Context) {
	quals, err := repository.GetAllQualifications()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "success", "data": quals})
}

func HandleGetAllCustomOrders(c *gin.Context) {
	orders, err := repository.GetAllCustomOrders()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "success", "data": orders})
}

func HandleSysUpdate(c *gin.Context) {
	// 调 ABE 服务更新系统主密钥
	ok, msg := service.UpdateSystemKeys()
	if ok {
		// 标记所有旧资质为过期
		repository.ExpireAllQualifications()
		c.JSON(200, gin.H{"status": "success", "message": msg, "abe_rekey": true})
	} else {
		c.JSON(200, gin.H{"status": "partial", "message": "规则已更新，但ABE密钥服务未响应: " + msg, "abe_rekey": false})
	}
}

func HandleDeleteUser(c *gin.Context) {
	id := c.Param("id")
	if err := repository.DeleteUser(id); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	// Check if actually deleted (affected rows is 0 for protected roles or missing user)
	c.JSON(200, gin.H{"status": "success", "message": "账号已删除"})
}
