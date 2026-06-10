package router

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"

	"fruit_backend/internal/handler"
	"fruit_backend/internal/middleware"
	"fruit_backend/internal/model"

	"github.com/gin-gonic/gin"
	"github.com/hyperledger/fabric-sdk-go/pkg/core/config"
	"github.com/hyperledger/fabric-sdk-go/pkg/gateway"
)

func InitFabric() {
	base := getEnv("FABRIC_BASE_PATH", "/home/sitong/HyperledgerFabric/fabric-samples/test-network")
	ccpPath := filepath.Join(base, "organizations", "peerOrganizations", "org1.example.com", "connection-org1.yaml")
	credPath := filepath.Join(base, "organizations", "peerOrganizations", "org1.example.com", "users", "User1@org1.example.com", "msp")
	certPath := filepath.Join(credPath, "signcerts", "User1@org1.example.com-cert.pem")
	keyDir := filepath.Join(credPath, "keystore")

	files, err := ioutil.ReadDir(keyDir)
	if err != nil || len(files) == 0 {
		fmt.Printf("[WARN] Fabric未连接: %v\n", err)
		return
	}
	keyPath := filepath.Join(keyDir, files[0].Name())
	certBytes, _ := ioutil.ReadFile(certPath)
	keyBytes, _ := ioutil.ReadFile(keyPath)

	wallet := gateway.NewInMemoryWallet()
	identity := gateway.NewX509Identity("Org1MSP", string(certBytes), string(keyBytes))
	if err = wallet.Put("appUser", identity); err != nil { return }
	gw, err := gateway.Connect(
		gateway.WithConfig(config.FromFile(filepath.Clean(ccpPath))),
		gateway.WithIdentity(wallet, "appUser"),
	)
	if err != nil { return }
	network, err := gw.GetNetwork("mychannel")
	if err != nil { return }
	_ = network.GetContract("traceability")
	model.FabricReady = true
	fmt.Println("[OK] Fabric 已连接")
}

func Setup() *gin.Engine {
	r := gin.Default()
	r.Use(middleware.CORS())

	// 认证
	r.POST("/api/auth/login", handler.HandleLogin)
	r.POST("/api/auth/register", handler.HandleRegister)

	// 商品
	r.GET("/api/products", handler.HandleGetProducts)
	r.GET("/api/products/:id", handler.HandleGetProductDetail)
	r.GET("/api/my-products", handler.HandleGetMyProducts)
	r.POST("/api/products", handler.HandleCreateProduct)

	// 产品档案
	r.GET("/api/archive/:productId", handler.HandleGetArchive)

	// 定制需求
	r.POST("/api/custom-order", handler.HandleCreateCustomOrder)
	r.GET("/api/custom-orders", handler.HandleGetMyCustomOrders)
	r.GET("/api/custom-orders/:id", handler.HandleGetCustomOrderDetail)
	r.POST("/api/custom-orders/:id/respond", handler.HandleRespondToOrder)

	// 需求市场
	r.GET("/api/demand-market", handler.HandleGetDemandMarket)

	// 资质
	r.GET("/api/my-qualifications", handler.HandleGetMyQualifications)
	r.POST("/api/qualifications/apply", handler.HandleApplyQualification)

	// 审核方
	r.GET("/api/review-list", handler.HandleGetReviewList)
	r.POST("/api/review/:id/approve", handler.HandleApproveReview)
	r.POST("/api/review/:id/reject", handler.HandleRejectReview)
	r.POST("/api/qualifications/:id/revoke", handler.HandleRevokeQualification)

	// 管理员
	r.GET("/api/admin/users", handler.HandleGetAllUsers)
	r.GET("/api/admin/qualifications", handler.HandleGetAllQualifications)
	r.GET("/api/admin/orders", handler.HandleGetAllCustomOrders)
	r.POST("/api/admin/sys-update", handler.HandleSysUpdate)

	// 监管方
	r.GET("/api/regulator/search", handler.HandleRegulatorSearch)
	r.POST("/api/regulator/emergency", handler.HandleEmergencyDecrypt)

	// 静态文件
	fr := getFrontendRoot()
	r.StaticFile("/", filepath.Join(fr, "index.html"))
	r.Static("/css", filepath.Join(fr, "css"))
	r.Static("/js", filepath.Join(fr, "js"))
	r.Static("/public", filepath.Join(fr, "public"))

	return r
}

func getEnv(k, fb string) string {
	if v := os.Getenv(k); v != "" { return v }
	return fb
}

func getFrontendRoot() string {
	if fr := os.Getenv("FRONTEND_ROOT"); fr != "" { return fr }
	paths := []string{"frontend", "../frontend", filepath.Join(os.Getenv("HOME"), "program", "frontend"), "/home/sitong/program/frontend"}
	for _, p := range paths {
		if _, err := os.Stat(filepath.Join(p, "index.html")); err == nil { return p }
	}
	return "frontend"
}
