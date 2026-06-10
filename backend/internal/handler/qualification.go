package handler

import (
	"fmt"
	"time"

	"fruit_backend/internal/model"

	"github.com/gin-gonic/gin"
)

func HandleGetMyQualifications(c *gin.Context) {
	holderID := c.Query("holder_id")
	var result []model.Qualification
	for _, q := range model.Qualifications {
		if q.HolderID == holderID { result = append(result, q) }
	}
	if result == nil { result = []model.Qualification{} }
	c.JSON(200, gin.H{"status":"success","data":result})
}

func HandleApplyQualification(c *gin.Context) {
	var req struct {
		HolderID   string `json:"holder_id"`
		HolderName string `json:"holder_name"`
		Type       string `json:"type"`
		Value      string `json:"value"`
		Evidence   string `json:"evidence"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error":"参数错误"}); return
	}
	q := model.Qualification{
		ID: fmt.Sprintf("Q%03d", len(model.Qualifications)+1),
		HolderID: req.HolderID, HolderName: req.HolderName,
		Type: req.Type, Value: req.Value, Status: "pending",
		IssuedAt: time.Now().Format("2006-01-02"),
		ExpiresAt: time.Now().AddDate(1, 0, 0).Format("2006-01-02"),
	}
	model.Qualifications = append(model.Qualifications, q)
	c.JSON(200, gin.H{"status":"success","data":q,"message":"资质申请已提交"})
}
