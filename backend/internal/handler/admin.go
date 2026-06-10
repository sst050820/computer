package handler

import (
	"fruit_backend/internal/repository"

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
	c.JSON(200, gin.H{"status": "success", "message": "平台认证规则已更新，受影响通行凭证需重新获取"})
}
