package handler

import (
	"fmt"
	"time"

	"fruit_backend/internal/model"
	"fruit_backend/internal/repository"

	"github.com/gin-gonic/gin"
)

func HandleGetProducts(c *gin.Context) {
	category := c.Query("category")
	origin := c.Query("origin")
	keyword := c.Query("keyword")
	result, err := repository.GetProducts(keyword, category, origin)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "success", "data": result, "total": len(result)})
}

func HandleGetProductDetail(c *gin.Context) {
	id := c.Param("id")
	p, err := repository.GetProductByID(id)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	if p == nil {
		c.JSON(404, gin.H{"error": "商品不存在"})
		return
	}
	c.JSON(200, gin.H{"status": "success", "data": p})
}

func HandleGetMyProducts(c *gin.Context) {
	shopID := c.Query("shop_id")
	result, err := repository.GetProductsByShop(shopID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "success", "data": result})
}

func HandleCreateProduct(c *gin.Context) {
	var p model.Product
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(400, gin.H{"error": "参数错误"})
		return
	}
	// Generate ID
	allProds, _ := repository.GetProducts("", "", "")
	p.ID = fmt.Sprintf("P%03d", len(allProds)+1)
	p.CreatedAt = time.Now().Format("2006-01-02")

	if err := repository.CreateProduct(&p); err != nil {
		c.JSON(500, gin.H{"error": "创建失败: " + err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "success", "data": p, "message": "商品发布成功"})
}
