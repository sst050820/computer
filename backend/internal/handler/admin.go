package handler

import (

	"fruit_backend/internal/model"

	"github.com/gin-gonic/gin"
)

func HandleGetAllUsers(c *gin.Context) {
	var result []*model.User
	for _, u := range model.Users { result = append(result, u) }
	c.JSON(200, gin.H{"status":"success","data":result})
}

func HandleGetAllQualifications(c *gin.Context) {
	c.JSON(200, gin.H{"status":"success","data":model.Qualifications})
}

func HandleGetAllCustomOrders(c *gin.Context) {
	var result []*model.CustomOrder
	for _, o := range model.CustomOrders { result = append(result, o) }
	if result == nil { result = []*model.CustomOrder{} }
	c.JSON(200, gin.H{"status":"success","data":result})
}

func HandleSysUpdate(c *gin.Context) {
	c.JSON(200, gin.H{"status":"success","message":"平台认证规则已更新，受影响通行凭证需重新获取"})
}
