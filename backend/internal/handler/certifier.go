package handler

import (

	"fruit_backend/internal/model"

	"github.com/gin-gonic/gin"
)

func HandleGetReviewList(c *gin.Context) {
	var pending []model.Qualification
	for _, q := range model.Qualifications {
		if q.Status == "pending" { pending = append(pending, q) }
	}
	if pending == nil { pending = []model.Qualification{} }
	c.JSON(200, gin.H{"status":"success","data":pending})
}

func HandleApproveReview(c *gin.Context) {
	id := c.Param("id")
	var req struct{ CertifierID string `json:"certifier_id"` }
	c.ShouldBindJSON(&req)
	for i, q := range model.Qualifications {
		if q.ID == id {
			model.Qualifications[i].Status = "active"
			if req.CertifierID != "" {
				model.Qualifications[i].CertifierID = req.CertifierID
				if u, ok := model.Users[req.CertifierID]; ok {
					model.Qualifications[i].CertifierName = u.Name
				}
			}
			c.JSON(200, gin.H{"status":"success","message":"资质审批通过","data":model.Qualifications[i]})
			return
		}
	}
	c.JSON(404, gin.H{"error":"申请不存在"})
}

func HandleRejectReview(c *gin.Context) {
	id := c.Param("id")
	for i, q := range model.Qualifications {
		if q.ID == id {
			model.Qualifications[i].Status = "rejected"
			c.JSON(200, gin.H{"status":"success","message":"已驳回"}); return
		}
	}
	c.JSON(404, gin.H{"error":"申请不存在"})
}

func HandleRevokeQualification(c *gin.Context) {
	id := c.Param("id")
	for i, q := range model.Qualifications {
		if q.ID == id {
			model.Qualifications[i].Status = "revoked"
			c.JSON(200, gin.H{"status":"success","message":"资质已收回"}); return
		}
	}
	c.JSON(404, gin.H{"error":"资质不存在"})
}
