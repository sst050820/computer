package handler

import (
	"fmt"
	"time"

	"fruit_backend/internal/model"
	"fruit_backend/internal/repository"

	"github.com/gin-gonic/gin"
)

// HandleCreateOrder 消费者下单（从购物车结算）
func HandleCreateOrder(c *gin.Context) {
	var req struct {
		ConsumerID   string  `json:"consumer_id"`
		ConsumerName string  `json:"consumer_name"`
		MerchantID   string  `json:"merchant_id"`
		ProductID    string  `json:"product_id"`
		ProductName  string  `json:"product_name"`
		Quantity     int     `json:"quantity"`
		Price        float64 `json:"price"`
		Remark       string  `json:"remark"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "参数错误"})
		return
	}
	if req.ConsumerID == "" || req.ProductID == "" {
		c.JSON(400, gin.H{"error": "消费者ID和商品ID为必填"})
		return
	}
	if req.Quantity <= 0 {
		req.Quantity = 1
	}

	order := &model.Order{
		ID:           fmt.Sprintf("ORD%03d", repository.CountOrders()+1),
		ConsumerID:   req.ConsumerID,
		ConsumerName: req.ConsumerName,
		MerchantID:   req.MerchantID,
		ProductID:    req.ProductID,
		ProductName:  req.ProductName,
		Quantity:     req.Quantity,
		Price:        req.Price,
		Total:        req.Price * float64(req.Quantity),
		Status:       "pending",
		Remark:       req.Remark,
		CreatedAt:    time.Now().Format("2006-01-02 15:04"),
	}

	if err := repository.CreateOrder(order); err != nil {
		c.JSON(500, gin.H{"error": "下单失败: " + err.Error()})
		return
	}

	c.JSON(200, gin.H{"status": "success", "message": "下单成功", "data": order})
}

// HandleGetMerchantOrders 商家查看自己的订单
func HandleGetMerchantOrders(c *gin.Context) {
	merchantID := c.Query("merchant_id")
	if merchantID == "" {
		c.JSON(400, gin.H{"error": "缺少merchant_id"})
		return
	}
	orders, err := repository.GetOrdersByMerchant(merchantID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "success", "data": orders, "total": len(orders)})
}

// HandleGetConsumerOrders 消费者查看自己的订单
func HandleGetConsumerOrders(c *gin.Context) {
	consumerID := c.Query("consumer_id")
	if consumerID == "" {
		c.JSON(400, gin.H{"error": "缺少consumer_id"})
		return
	}
	orders, err := repository.GetOrdersByConsumer(consumerID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "success", "data": orders, "total": len(orders)})
}

// HandleUpdateOrderStatus 商家更新订单状态
func HandleUpdateOrderStatus(c *gin.Context) {
	orderID := c.Param("id")
	var req struct {
		Status string `json:"status"`
		Remark string `json:"remark"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "参数错误"})
		return
	}
	validStatuses := map[string]bool{
		"pending": true, "confirmed": true, "shipped": true,
		"delivered": true, "completed": true, "cancelled": true,
	}
	if !validStatuses[req.Status] {
		c.JSON(400, gin.H{"error": "无效状态"})
		return
	}
	if err := repository.UpdateOrderStatus(orderID, req.Status); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "success", "message": "订单状态已更新为: " + req.Status})
}
