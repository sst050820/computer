package handler

import (

	"fruit_backend/internal/model"
	"fruit_backend/internal/service"

	"github.com/gin-gonic/gin"
)

func HandleGetDemandMarket(c *gin.Context) {
	merchantID := c.Query("merchant_id")
	var merchantQuals []model.Qualification
	for _, q := range model.Qualifications {
		if q.HolderID == merchantID && q.Status == "active" {
			merchantQuals = append(merchantQuals, q)
		}
	}
	merchantAttrs := make(map[string]string)
	for _, q := range merchantQuals {
		merchantAttrs[q.Type] = q.Value
	}

	var result []map[string]interface{}
	for _, order := range model.CustomOrders {
		if order.Status != "active" { continue }
		matched := true
		matchDetails := make(map[string]interface{})
		for k, v := range order.Conditions {
			if mv, ok := merchantAttrs[k]; ok && mv == v {
				matchDetails[k] = map[string]interface{}{"required": v, "yours": mv, "match": true}
			} else {
				matched = false
				yours := "无"
				if ok { yours = mv }
				matchDetails[k] = map[string]interface{}{"required": v, "yours": yours, "match": false}
			}
		}
		item := map[string]interface{}{
			"id": order.ID, "title": order.Title, "budget": order.Budget,
			"policy": order.Policy, "policy_display": service.PolicyToDisplay(order.Policy),
			"conditions": order.Conditions, "match_details": matchDetails, "matched": matched,
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
	if result == nil { result = []map[string]interface{}{} }
	c.JSON(200, gin.H{"status":"success","data":result,"total":len(result)})
}
