package handler

import (
	"fruit_backend/internal/repository"

	"github.com/gin-gonic/gin"
)

func HandleGetReviewList(c *gin.Context) {
	pending, err := repository.GetPendingReviews()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "success", "data": pending})
}

func HandleApproveReview(c *gin.Context) {
	id := c.Param("id")
	var req struct{ CertifierID string `json:"certifier_id"` }
	c.ShouldBindJSON(&req)

	certifierName := ""
	if u, err := repository.GetUserByID(req.CertifierID); err == nil && u != nil {
		certifierName = u.Name
	}

	if err := repository.ApproveQualification(id, req.CertifierID, certifierName); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "success", "message": "资质审批通过"})
}

func HandleRejectReview(c *gin.Context) {
	id := c.Param("id")
	if err := repository.RejectQualification(id); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "success", "message": "已驳回"})
}

func HandleRevokeQualification(c *gin.Context) {
	id := c.Param("id")
	if err := repository.RevokeQualification(id); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "success", "message": "资质已收回"})
}

func HandleRenewQualification(c *gin.Context) {
	id := c.Param("id")
	var req struct{ ExpiresAt string `json:"expires_at"` }
	c.ShouldBindJSON(&req)
	if req.ExpiresAt == "" {
		req.ExpiresAt = "2027-12-31"
	}
	if err := repository.RenewQualification(id, req.ExpiresAt); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "success", "message": "资质已续期"})
}

func HandleRestoreQualification(c *gin.Context) {
	id := c.Param("id")
	if err := repository.RestoreQualification(id); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"status": "success", "message": "资质已恢复"})
}
