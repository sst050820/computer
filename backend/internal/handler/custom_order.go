package handler

import (
	"fmt"
	"time"

	"fruit_backend/internal/model"
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
		c.JSON(400, gin.H{"error":"参数错误"}); return
	}

	policy := service.ConditionToPolicy(req.Conditions)
	orderID := fmt.Sprintf("CO%03d", len(model.CustomOrders)+1)
	sessionID, ciphertext, _ := service.EncryptWithABE(req.Description + " | 预算:" + req.Budget)

	if model.FabricReady {
		service.SubmitToFabric(orderID, ciphertext, req.Conditions["Location"])
	}

	consumerName := ""
	if u, ok := model.Users[req.ConsumerID]; ok { consumerName = u.Name }

	order := &model.CustomOrder{
		ID: orderID, Title: req.Title, Description: req.Description,
		Budget: req.Budget, Conditions: req.Conditions, Policy: policy,
		SessionID: sessionID, Ciphertext: ciphertext,
		ConsumerID: req.ConsumerID, ConsumerName: consumerName,
		Status: "active", CreatedAt: time.Now().Format("2006-01-02 15:04"),
		Responses: make([]model.OrderResponse, 0),
	}
	model.CustomOrders[orderID] = order

	c.JSON(200, gin.H{
		"status":"success","message":"定制需求已定向发布","data":order,
		"policy_tip": service.PolicyToDisplay(policy),
	})
}

func HandleGetMyCustomOrders(c *gin.Context) {
	consumerID := c.Query("consumer_id")
	var result []*model.CustomOrder
	for _, o := range model.CustomOrders {
		if o.ConsumerID == consumerID { result = append(result, o) }
	}
	if result == nil { result = []*model.CustomOrder{} }
	c.JSON(200, gin.H{"status":"success","data":result})
}

func HandleGetCustomOrderDetail(c *gin.Context) {
	id := c.Param("id")
	if o, ok := model.CustomOrders[id]; ok {
		c.JSON(200, gin.H{"status":"success","data":o}); return
	}
	c.JSON(404, gin.H{"error":"需求不存在"})
}

func HandleRespondToOrder(c *gin.Context) {
	orderID := c.Param("id")
	var resp model.OrderResponse
	if err := c.ShouldBindJSON(&resp); err != nil {
		c.JSON(400, gin.H{"error":"参数错误"}); return
	}
	resp.ID = fmt.Sprintf("R%03d", len(model.CustomOrders))
	resp.CreatedAt = time.Now().Format("2006-01-02 15:04")
	if o, ok := model.CustomOrders[orderID]; ok {
		o.Responses = append(o.Responses, resp)
		c.JSON(200, gin.H{"status":"success","message":"响应已提交"}); return
	}
	c.JSON(404, gin.H{"error":"需求不存在"})
}
