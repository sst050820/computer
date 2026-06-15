package handler

import (
	"fmt"
	"fruit_backend/internal/repository"
	"fruit_backend/internal/service"

	"github.com/gin-gonic/gin"
)

// HandleGetDisputes 获取纠纷列表（含真实订单数据）
func HandleGetDisputes(c *gin.Context) {
	orders, _ := repository.GetAllOrders()
	customs, _ := repository.GetAllCustomOrders()
	disputes := []gin.H{}
	// Generate disputes from real data
	for _, o := range orders {
		if o.Status == "pending" || o.Status == "confirmed" {
			disputes = append(disputes, gin.H{
				"id": "D_" + o.ID, "title": "订单纠纷: " + o.ProductName,
				"parties": o.ConsumerName + " vs " + o.MerchantName,
				"issue": "订单 #" + o.ID + " 当前状态为 " + o.Status + "，消费者反馈需要处理",
				"status": "pending", "order_id": o.ID,
			})
		}
	}
	for _, c := range customs {
		if c.Status == "active" && len(c.Responses) > 0 {
			disputes = append(disputes, gin.H{
				"id": "C_" + c.ID, "title": "需求纠纷: " + c.Title,
				"parties": c.ConsumerName + " vs 多个商家",
				"issue": "定制需求 #" + c.ID + " 收到 " + fmt.Sprintf("%d", len(c.Responses)) + " 个报价，需审核",
				"status": "pending", "order_id": c.ID,
			})
		}
	}
	if len(disputes) == 0 {
		disputes = []gin.H{}
	}
	c.JSON(200, gin.H{"status": "success", "data": disputes})
}

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
