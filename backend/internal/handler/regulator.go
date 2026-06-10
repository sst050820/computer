package handler

import (
	"strings"

	"fruit_backend/internal/model"

	"github.com/gin-gonic/gin"
)

func HandleRegulatorSearch(c *gin.Context) {
	keyword := c.Query("keyword")
	var result []map[string]interface{}
	for _, p := range model.Products {
		if keyword == "" || strings.Contains(p.Name, keyword) || strings.Contains(p.Origin, keyword) || strings.Contains(p.ID, keyword) {
			result = append(result, map[string]interface{}{"product": p, "archive": model.Archives[p.ID], "can_view": true})
		}
	}
	if result == nil { result = []map[string]interface{}{} }
	c.JSON(200, gin.H{"status":"success","data":result})
}

func HandleEmergencyDecrypt(c *gin.Context) {
	var req struct{ ProductID string `json:"product_id"` }
	c.ShouldBindJSON(&req)
	c.JSON(200, gin.H{"status":"success","message":"应急解密已启用","data":model.Archives[req.ProductID]})
}
