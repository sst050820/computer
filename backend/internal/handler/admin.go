package handler

import (
	"fmt"
	"fruit_backend/internal/repository"
	"fruit_backend/internal/service"

	"github.com/gin-gonic/gin"
)

func HandleGetDisputes(c *gin.Context) {
	orders, _ := repository.GetAllOrders()
	customs, _ := repository.GetAllCustomOrders()
	disputes := []gin.H{}

	for _, o := range orders {
		if o.Status == "pending" || o.Status == "confirmed" {
			disputes = append(disputes, gin.H{
				"id":       "D_" + o.ID,
				"title":    "订单纠纷: " + o.ProductName,
				"parties":  o.ConsumerName + " vs " + o.MerchantName,
				"issue":   "订单 #" + o.ID + " 当前状态为 " + o.Status + "，消费者反馈需要处理",
				"status":  "pending",
				"order_id": o.ID,
			})
		}
	}

	for _, custom := range customs {
		if custom.Status == "active" && len(custom.Responses) > 0 {
			disputes = append(disputes, gin.H{
				"id":       "C_" + custom.ID,
				"title":    "需求纠纷: " + custom.Title,
				"parties":  custom.ConsumerName + " vs 多个商家",
				"issue":   "定制需求 #" + custom.ID + " 收到 " + fmt.Sprintf("%d", len(custom.Responses)) + " 个报价，需审核",
				"status":  "pending",
				"order_id": custom.ID,
			})
		}
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
	var req struct {
		Strategy  string `json:"strategy"`
		AttrType  string `json:"attr_type"`
		AttrValue string `json:"attr_value"`
	}
	_ = c.ShouldBindJSON(&req)
	if req.Strategy == "" {
		req.Strategy = "global_rekey"
	}

	switch req.Strategy {
	case "rules_only":
		c.JSON(200, gin.H{
			"status":                 "success",
			"strategy":               "rules_only",
			"message":                "认证规则版本已更新，现有资质保持有效",
			"abe_rekey":              false,
			"qualifications_expired": false,
		})
	case "attribute_revoke":
		if req.AttrType == "" || req.AttrValue == "" {
			c.JSON(400, gin.H{"error": "属性撤销需要 attr_type 和 attr_value"})
			return
		}
		ok, msg := service.RevokeAttribute(req.AttrType, req.AttrValue)
		if !ok {
			c.JSON(200, gin.H{
				"status":     "partial",
				"strategy":   "attribute_revoke",
				"message":    msg,
				"abe_revoke": false,
				"abe_rekey":  false,
			})
			return
		}
		if err := repository.RevokeQualificationsByAttribute(req.AttrType, req.AttrValue); err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{
			"status":     "success",
			"strategy":   "attribute_revoke",
			"message":    msg,
			"abe_revoke": true,
			"attr_type":  req.AttrType,
			"attr_value": req.AttrValue,
			"abe_rekey":  false,
		})
	case "global_rekey":
		ok, msg := service.UpdateSystemKeys()
		if ok {
			_ = repository.ExpireAllQualifications()
			c.JSON(200, gin.H{
				"status":                 "success",
				"strategy":               "global_rekey",
				"message":                msg,
				"abe_rekey":              true,
				"qualifications_expired": true,
			})
			return
		}
		c.JSON(200, gin.H{
			"status":    "partial",
			"strategy":  "global_rekey",
			"message":   "规则已更新，但ABE密钥服务未响应: " + msg,
			"abe_rekey": false,
		})
	default:
		c.JSON(400, gin.H{"error": "未知更新策略: " + req.Strategy})
	}
}

func HandleDeleteUser(c *gin.Context) {
	id := c.Param("id")
	if err := repository.DeleteUser(id); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "success", "message": "账号已删除"})
}
