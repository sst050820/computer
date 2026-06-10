package model

import "sync"

// User 用户
type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Name     string `json:"name"`
	Role     string `json:"role"`
	Phone    string `json:"phone"`
	Location string `json:"location"`
}

// RegisterRequest 注册请求
type RegisterRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Name     string `json:"name"`
	Role     string `json:"role"`
	Phone    string `json:"phone"`
	Location string `json:"location"`
}

// Product 商品
type Product struct {
	ID            string  `json:"id"`
	Name          string  `json:"name"`
	Category      string  `json:"category"`
	Origin        string  `json:"origin"`
	Price         float64 `json:"price"`
	Image         string  `json:"image"`
	Certification string  `json:"certification"`
	Traceable     bool    `json:"traceable"`
	ShopID        string  `json:"shop_id"`
	ShopName      string  `json:"shop_name"`
	CreatedAt     string  `json:"created_at"`
}

// CustomOrder 定制需求
type CustomOrder struct {
	ID           string            `json:"id"`
	Title        string            `json:"title"`
	Description  string            `json:"description"`
	Budget       string            `json:"budget"`
	Conditions   map[string]string `json:"conditions"`
	Policy       string            `json:"policy"`
	SessionID    string            `json:"session_id"`
	Ciphertext   string            `json:"ciphertext"`
	ConsumerID   string            `json:"consumer_id"`
	ConsumerName string            `json:"consumer_name"`
	Status       string            `json:"status"`
	CreatedAt    string            `json:"created_at"`
	Responses    []OrderResponse   `json:"responses,omitempty"`
}

// OrderResponse 订单响应
type OrderResponse struct {
	ID         string `json:"id"`
	MerchantID string `json:"merchant_id"`
	Name       string `json:"name"`
	Price      string `json:"price"`
	Message    string `json:"message"`
	CreatedAt  string `json:"created_at"`
}

// Qualification 资质
type Qualification struct {
	ID            string `json:"id"`
	HolderID      string `json:"holder_id"`
	HolderName    string `json:"holder_name"`
	Type          string `json:"type"`
	Value         string `json:"value"`
	Status        string `json:"status"`
	CertifierID   string `json:"certifier_id"`
	CertifierName string `json:"certifier_name"`
	IssuedAt      string `json:"issued_at"`
	ExpiresAt     string `json:"expires_at"`
}

// ArchiveNode 档案节点
type ArchiveNode struct {
	Step     string `json:"step"`
	Location string `json:"location"`
	Time     string `json:"time"`
	Desc     string `json:"desc"`
	Public   bool   `json:"public"`
}

// LoginRequest 登录请求
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

// 全局状态
var (
	Users          = make(map[string]*User)
	Products       = make([]Product, 0)
	CustomOrders   = make(map[string]*CustomOrder)
	Qualifications = make([]Qualification, 0)
	Archives       = make(map[string][]ArchiveNode)
	ABESessions    = make(map[string]string)
	Mu             sync.RWMutex
	FabricReady    bool
)
