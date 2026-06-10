package handler

import (
	"fruit_backend/internal/model"
	"fruit_backend/internal/repository"
	"fruit_backend/internal/service"

	"github.com/gin-gonic/gin"
)

func HandleGetDemandMarket(c *gin.Context) {
	merchantID := c.Query("merchant_id")

	// Get merchant's active qualifications
	merchantQuals, _ := repository.GetQualificationsByHolder(merchantID)
	merchantAttrs := make(map[string]string)
	for _, q := range merchantQuals {
		if q.Status == "active" {
			merchantAttrs[q.Type] = q.Value
		}
	}

	// Get all active custom orders
	orders, err := repository.GetAllCustomOrders()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	// Check matching
	var result []map[string]interface{}
	for _, order := range orders {
		if order.Status != "active" {
			continue
		}
		// Re-load order with conditions (GetAllCustomOrders doesn't load conditions)
		fullOrder, _ := repository.GetCustomOrderByID(order.ID)
		if fullOrder == nil {
			continue
		}

		matched := true
		matchDetails := make(map[string]interface{})
		for k, v := range fullOrder.Conditions {
			if mv, ok := merchantAttrs[k]; ok && mv == v {
				matchDetails[k] = map[string]interface{}{"required": v, "yours": mv, "match": true}
			} else {
				matched = false
				yours := "无"
				if ok {
					yours = mv
				}
				matchDetails[k] = map[string]interface{}{"required": v, "yours": yours, "match": false}
			}
		}
		item := map[string]interface{}{
			"id": order.ID, "title": order.Title, "budget": order.Budget,
			"policy": order.Policy, "policy_display": service.PolicyToDisplay(order.Policy),
			"conditions": fullOrder.Conditions, "match_details": matchDetails, "matched": matched,
			"consumer_name": order.ConsumerName, "status": order.Status, "created_at": order.CreatedAt,
		}
		if matched {
			item["description"] = order.Description
			item["can_view"] = true
		} else {
			item["description"] = "🔒 此需求仅对满足条件的厂家定向可见"
			item["can_view"] = false
		}
		result = append(result, item)
	}
	if result == nil {
		result = []map[string]interface{}{}
	}
	c.JSON(200, gin.H{"status": "success", "data": result, "total": len(result)})
}

// Unused import guard
var _ = model.Qualification{}
