package handler

import (
	"fruit_backend/internal/repository"

	"github.com/gin-gonic/gin"
)

func HandleRegulatorSearch(c *gin.Context) {
	keyword := c.Query("keyword")
	products, err := repository.GetProducts(keyword, "", "")
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	var result []map[string]interface{}
	for _, p := range products {
		archive, _ := repository.GetArchive(p.ID)
		result = append(result, map[string]interface{}{
			"product":  p,
			"archive":  archive,
			"can_view": true,
		})
	}
	if result == nil {
		result = []map[string]interface{}{}
	}
	c.JSON(200, gin.H{"status": "success", "data": result})
}

func HandleEmergencyDecrypt(c *gin.Context) {
	var req struct{ ProductID string `json:"product_id"` }
	c.ShouldBindJSON(&req)
	archive, _ := repository.GetArchive(req.ProductID)
	c.JSON(200, gin.H{"status": "success", "message": "应急解密已启用", "data": archive})
}
