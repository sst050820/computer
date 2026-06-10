package model

type User struct {
	ID string `json:"id"`; Username string `json:"username"`
	Password string `json:"password"`; Name string `json:"name"`
	Role string `json:"role"`; Phone string `json:"phone"`
	Location string `json:"location"`
}
type RegisterRequest struct {
	Username string `json:"username"`; Password string `json:"password"`
	Name string `json:"name"`; Role string `json:"role"`
	Phone string `json:"phone"`; Location string `json:"location"`
}
type Product struct {
	ID string `json:"id"`; Name string `json:"name"`
	Category string `json:"category"`; Origin string `json:"origin"`
	Price float64 `json:"price"`; Image string `json:"image"`
	Certification string `json:"certification"`; Traceable bool `json:"traceable"`
	ShopID string `json:"shop_id"`; ShopName string `json:"shop_name"`
	CreatedAt string `json:"created_at"`
}
type CustomOrder struct {
	ID string `json:"id"`; Title string `json:"title"`
	Description string `json:"description"`; Budget string `json:"budget"`
	Conditions map[string]string `json:"conditions"`; Policy string `json:"policy"`
	SessionID string `json:"session_id"`; Ciphertext string `json:"ciphertext"`
	ConsumerID string `json:"consumer_id"`; ConsumerName string `json:"consumer_name"`
	Status string `json:"status"`; CreatedAt string `json:"created_at"`
	Responses []OrderResponse `json:"responses,omitempty"`
}
type OrderResponse struct {
	ID string `json:"id"`; MerchantID string `json:"merchant_id"`
	Name string `json:"name"`; Price string `json:"price"`
	Message string `json:"message"`; CreatedAt string `json:"created_at"`
}
type Qualification struct {
	ID string `json:"id"`; HolderID string `json:"holder_id"`
	HolderName string `json:"holder_name"`; Type string `json:"type"`
	Value string `json:"value"`; Status string `json:"status"`
	CertifierID string `json:"certifier_id"`; CertifierName string `json:"certifier_name"`
	IssuedAt string `json:"issued_at"`; ExpiresAt string `json:"expires_at"`
}
type ArchiveNode struct {
	Step string `json:"step"`; Location string `json:"location"`
	Time string `json:"time"`; Desc string `json:"desc"`
	Public bool `json:"public"`
}
type LoginRequest struct {
	Username string `json:"username"`; Password string `json:"password"`
	Role string `json:"role"`
}
type Order struct {
	ID string `json:"id"`; ConsumerID string `json:"consumer_id"`
	ConsumerName string `json:"consumer_name"`; MerchantID string `json:"merchant_id"`
	ProductID string `json:"product_id"`; ProductName string `json:"product_name"`
	Quantity int `json:"quantity"`; Price float64 `json:"price"`
	Total float64 `json:"total"`; Status string `json:"status"`
	Remark string `json:"remark"`; CreatedAt string `json:"created_at"`
}
var (
	ABESessions = make(map[string]string)
	FabricReady bool
)
