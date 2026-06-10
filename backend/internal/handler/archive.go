package handler

import (
	"fruit_backend/internal/model"
	"fruit_backend/internal/repository"

	"github.com/gin-gonic/gin"
)

func HandleGetArchive(c *gin.Context) {
	productID := c.Param("productId")
	role := c.Query("role")

	nodes, _ := repository.GetArchive(productID)
	if len(nodes) == 0 {
		// Fallback demo data if archive is empty
		nodes = []model.ArchiveNode{
			{Step: "种植", Location: "原产地农场", Time: "2026-03-15", Desc: "标准化种植", Public: true},
			{Step: "加工", Location: "加工车间", Time: "2026-03-20", Desc: "产品加工", Public: true},
			{Step: "质检", Location: "检测中心", Time: "2026-04-01", Desc: "质量检测", Public: false},
			{Step: "运输", Location: "物流中心", Time: "2026-04-05", Desc: "冷链运输", Public: false},
		}
	}

	if role == "regulator" || role == "admin" || role == "certifier" {
		c.JSON(200, gin.H{"status": "success", "data": nodes, "full_access": true})
		return
	}

	var publicNodes []model.ArchiveNode
	for _, n := range nodes {
		if n.Public {
			publicNodes = append(publicNodes, n)
		} else {
			publicNodes = append(publicNodes, model.ArchiveNode{
				Step: n.Step, Location: "需授权查看", Time: n.Time,
				Desc: "🔒 此环节信息仅对授权方可见", Public: false,
			})
		}
	}
	c.JSON(200, gin.H{"status": "success", "data": publicNodes, "full_access": false})
}
