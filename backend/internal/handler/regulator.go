package handler

import (
	"fruit_backend/internal/model"
	"fruit_backend/internal/repository"

	"github.com/gin-gonic/gin"
)

func HandleRegulatorSearch(c *gin.Context) {
	keyword := c.Query("keyword")
	// Try exact ID match first
	products := []model.Product{}
	if p, err := repository.GetProductByID(keyword); err == nil && p != nil {
		products = append(products, *p)
	}
	// Also search by name
	if nameResults, err := repository.GetProducts(keyword, "", ""); err == nil {
		for _, p := range nameResults {
			// Avoid duplicate
			found := false
			for _, existing := range products {
				if existing.ID == p.ID { found = true; break }
			}
			if !found { products = append(products, p) }
		}
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
