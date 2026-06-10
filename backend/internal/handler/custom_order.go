package handler

import (
	"fmt"
	"time"

	"fruit_backend/internal/model"
	"fruit_backend/internal/repository"
	"fruit_backend/internal/service"

	"github.com/gin-gonic/gin"
)

func HandleCreateCustomOrder(c *gin.Context) {
	var req struct {
		Title       string            `json:"title"`
		Description string            `json:"description"`
		Budget      string            `json:"budget"`
		Conditions  map[string]string `json:"conditions"`
		ConsumerID  string            `json:"consumer_id"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "参数错误"})
		return
	}

	policy := service.ConditionToPolicy(req.Conditions)
	allOrders, _ := repository.GetAllCustomOrders()
	orderID := fmt.Sprintf("CO%03d", len(allOrders)+1)
	sessionID, ciphertext, _ := service.EncryptWithABE(req.Description + " | 预算:" + req.Budget)

	if model.FabricReady {
		service.SubmitToFabric(orderID, ciphertext, req.Conditions["Location"])
	}

	consumerName := ""
	if u, err := repository.GetUserByID(req.ConsumerID); err == nil && u != nil {
		consumerName = u.Name
	}

	order := &model.CustomOrder{
		ID: orderID, Title: req.Title, Description: req.Description,
		Budget: req.Budget, Conditions: req.Conditions, Policy: policy,
		SessionID: sessionID, Ciphertext: ciphertext,
		ConsumerID: req.ConsumerID, ConsumerName: consumerName,
		Status: "active", CreatedAt: time.Now().Format("2006-01-02 15:04"),
		Responses: make([]model.OrderResponse, 0),
	}

	if err := repository.CreateCustomOrder(order); err != nil {
		c.JSON(500, gin.H{"error": "创建失败: " + err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"status": "success", "message": "定制需求已定向发布", "data": order,
		"policy_tip": service.PolicyToDisplay(policy),
	})
}

func HandleGetMyCustomOrders(c *gin.Context) {
	consumerID := c.Query("consumer_id")
	result, err := repository.GetCustomOrdersByConsumer(consumerID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "success", "data": result})
}

func HandleGetCustomOrderDetail(c *gin.Context) {
	id := c.Param("id")
	o, err := repository.GetCustomOrderByID(id)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	if o == nil {
		c.JSON(404, gin.H{"error": "需求不存在"})
		return
	}
	c.JSON(200, gin.H{"status": "success", "data": o})
}

func HandleRespondToOrder(c *gin.Context) {
	orderID := c.Param("id")
	var resp model.OrderResponse
	if err := c.ShouldBindJSON(&resp); err != nil {
		c.JSON(400, gin.H{"error": "参数错误"})
		return
	}
	// Verify order exists
	o, err := repository.GetCustomOrderByID(orderID)
	if err != nil || o == nil {
		c.JSON(404, gin.H{"error": "需求不存在"})
		return
	}
	resp.ID = fmt.Sprintf("R%03d", len(o.Responses)+1)
	resp.CreatedAt = time.Now().Format("2006-01-02 15:04")

	if err := repository.AddOrderResponseProper(orderID, &resp); err != nil {
		c.JSON(500, gin.H{"error": "提交失败: " + err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "success", "message": "响应已提交"})
}

func HandleDeleteCustomOrder(c *gin.Context) {
	id := c.Param("id")
	if err := repository.DeleteCustomOrder(id); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "success", "message": "需求已删除"})
}
