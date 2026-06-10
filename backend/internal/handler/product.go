package handler

import (
	"fmt"
	"strings"
	"time"

	"fruit_backend/internal/model"

	"github.com/gin-gonic/gin"
)

func HandleGetProducts(c *gin.Context) {
	category := c.Query("category")
	origin := c.Query("origin")
	keyword := c.Query("keyword")
	var result []model.Product
	for _, p := range model.Products {
		if category != "" && p.Category != category { continue }
		if origin != "" && !strings.Contains(p.Origin, origin) { continue }
		if keyword != "" && !strings.Contains(p.Name, keyword) && !strings.Contains(p.Origin, keyword) { continue }
		result = append(result, p)
	}
	if result == nil { result = []model.Product{} }
	c.JSON(200, gin.H{"status":"success","data":result,"total":len(result)})
}

func HandleGetProductDetail(c *gin.Context) {
	id := c.Param("id")
	for _, p := range model.Products {
		if p.ID == id { c.JSON(200, gin.H{"status":"success","data":p}); return }
	}
	c.JSON(404, gin.H{"error":"商品不存在"})
}

func HandleGetMyProducts(c *gin.Context) {
	shopID := c.Query("shop_id")
	var result []model.Product
	for _, p := range model.Products {
		if p.ShopID == shopID { result = append(result, p) }
	}
	if result == nil { result = []model.Product{} }
	c.JSON(200, gin.H{"status":"success","data":result})
}

func HandleCreateProduct(c *gin.Context) {
	var p model.Product
	if err := c.ShouldBindJSON(&p); err != nil {
		c.JSON(400, gin.H{"error":"参数错误"}); return
	}
	p.ID = fmt.Sprintf("P%03d", len(model.Products)+1)
	p.CreatedAt = time.Now().Format("2006-01-02")
	model.Products = append(model.Products, p)
	c.JSON(200, gin.H{"status":"success","data":p,"message":"商品发布成功"})
}
