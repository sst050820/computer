package repository

import (
	"database/sql"
	"fmt"
	"fruit_backend/internal/model"
	"log"
	"strings"
)

// ==================== Users ====================

func CreateUser(u *model.User) error {
	_, err := DB.Exec(
		"INSERT INTO users (id, username, password, name, role, phone, location) VALUES (?,?,?,?,?,?,?)",
		u.ID, u.Username, u.Password, u.Name, u.Role, u.Phone, u.Location,
	)
	return err
}

func GetUserByUsername(username string) (*model.User, error) {
	u := &model.User{}
	err := DB.QueryRow(
		"SELECT id, username, password, name, role, phone, location FROM users WHERE username=?",
		username,
	).Scan(&u.ID, &u.Username, &u.Password, &u.Name, &u.Role, &u.Phone, &u.Location)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return u, err
}

func GetUserByID(id string) (*model.User, error) {
	u := &model.User{}
	err := DB.QueryRow(
		"SELECT id, username, password, name, role, phone, location FROM users WHERE id=?",
		id,
	).Scan(&u.ID, &u.Username, &u.Password, &u.Name, &u.Role, &u.Phone, &u.Location)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return u, err
}

func DeleteUser(id string) error {
	_, err := DB.Exec("DELETE FROM users WHERE id=? AND role IN ('consumer','merchant')", id)
	return err
}

func UpdateUserProfile(id, name, phone, location string) error {
	_, err := DB.Exec("UPDATE users SET name=?, phone=?, location=? WHERE id=?", name, phone, location, id)
	return err
}

func GetAllUsers() ([]model.User, error) {
	rows, err := DB.Query("SELECT id, username, name, role, phone, location FROM users ORDER BY created_at DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var users []model.User
	for rows.Next() {
		var u model.User
		if err := rows.Scan(&u.ID, &u.Username, &u.Name, &u.Role, &u.Phone, &u.Location); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	if users == nil {
		users = []model.User{}
	}
	return users, nil
}

// ==================== Products ====================

func CreateProduct(p *model.Product) error {
	_, err := DB.Exec(
		"INSERT INTO products (id, name, category, origin, price, image, certification, traceable, shop_id, shop_name) VALUES (?,?,?,?,?,?,?,?,?,?)",
		p.ID, p.Name, p.Category, p.Origin, p.Price, p.Image, p.Certification, p.Traceable, p.ShopID, p.ShopName,
	)
	return err
}

func GetProducts(keyword, category, origin string) ([]model.Product, error) {
	query := "SELECT id, name, category, origin, price, image, certification, traceable, shop_id, shop_name FROM products WHERE 1=1"
	var args []interface{}
	if keyword != "" {
		query += " AND name LIKE ?"
		args = append(args, "%"+keyword+"%")
	}
	if category != "" {
		query += " AND category=?"
		args = append(args, category)
	}
	if origin != "" {
		query += " AND origin=?"
		args = append(args, origin)
	}
	query += " ORDER BY created_at DESC"
	rows, err := DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var prods []model.Product
	for rows.Next() {
		var p model.Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Category, &p.Origin, &p.Price, &p.Image, &p.Certification, &p.Traceable, &p.ShopID, &p.ShopName); err != nil {
			return nil, err
		}
		prods = append(prods, p)
	}
	if prods == nil {
		prods = []model.Product{}
	}
	return prods, nil
}

func DeleteProduct(id string) error {
	_, err := DB.Exec("DELETE FROM products WHERE id=?", id)
	return err
}

func GetProductByID(id string) (*model.Product, error) {
	p := &model.Product{}
	err := DB.QueryRow(
		"SELECT id, name, category, origin, price, image, certification, traceable, shop_id, shop_name FROM products WHERE id=?",
		id,
	).Scan(&p.ID, &p.Name, &p.Category, &p.Origin, &p.Price, &p.Image, &p.Certification, &p.Traceable, &p.ShopID, &p.ShopName)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return p, err
}

func GetProductsByShop(shopID string) ([]model.Product, error) {
	rows, err := DB.Query(
		"SELECT id, name, category, origin, price, image, certification, traceable, shop_id, shop_name FROM products WHERE shop_id=? ORDER BY created_at DESC",
		shopID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var prods []model.Product
	for rows.Next() {
		var p model.Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Category, &p.Origin, &p.Price, &p.Image, &p.Certification, &p.Traceable, &p.ShopID, &p.ShopName); err != nil {
			return nil, err
		}
		prods = append(prods, p)
	}
	if prods == nil {
		prods = []model.Product{}
	}
	return prods, nil
}

func SearchProducts(keyword string) ([]model.Product, error) {
	return GetProducts(keyword, "", "")
}

// ==================== Custom Orders ====================

func CreateCustomOrder(o *model.CustomOrder) error {
	_, err := DB.Exec(
		"INSERT INTO custom_orders (id, title, description, budget, policy, session_id, ciphertext, consumer_id, consumer_name, status) VALUES (?,?,?,?,?,?,?,?,?,?)",
		o.ID, o.Title, o.Description, o.Budget, o.Policy, o.SessionID, o.Ciphertext, o.ConsumerID, o.ConsumerName, o.Status,
	)
	return err
}

func GetCustomOrdersByConsumer(consumerID string) ([]*model.CustomOrder, error) {
	rows, err := DB.Query(
		"SELECT id, title, description, budget, policy, session_id, ciphertext, consumer_id, consumer_name, status, created_at FROM custom_orders WHERE consumer_id=? ORDER BY created_at DESC",
		consumerID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var orders []*model.CustomOrder
	for rows.Next() {
		o := &model.CustomOrder{}
		if err := rows.Scan(&o.ID, &o.Title, &o.Description, &o.Budget, &o.Policy, &o.SessionID, &o.Ciphertext, &o.ConsumerID, &o.ConsumerName, &o.Status, &o.CreatedAt); err != nil {
			return nil, err
		}
		// Load responses
		respRows, err := DB.Query(
			"SELECT id, merchant_id, name, price, message, created_at FROM order_responses WHERE order_id=? ORDER BY created_at",
			o.ID,
		)
		if err == nil {
			defer respRows.Close()
			for respRows.Next() {
				var r model.OrderResponse
				if err := respRows.Scan(&r.ID, &r.MerchantID, &r.Name, &r.Price, &r.Message, &r.CreatedAt); err == nil {
					o.Responses = append(o.Responses, r)
				}
			}
		}
		if o.Responses == nil {
			o.Responses = []model.OrderResponse{}
		}
		orders = append(orders, o)
	}
	if orders == nil {
		orders = []*model.CustomOrder{}
	}
	return orders, nil
}

func GetCustomOrderByID(id string) (*model.CustomOrder, error) {
	o := &model.CustomOrder{}
	err := DB.QueryRow(
		"SELECT id, title, description, budget, policy, session_id, ciphertext, consumer_id, consumer_name, status, created_at FROM custom_orders WHERE id=?",
		id,
	).Scan(&o.ID, &o.Title, &o.Description, &o.Budget, &o.Policy, &o.SessionID, &o.Ciphertext, &o.ConsumerID, &o.ConsumerName, &o.Status, &o.CreatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	// Load responses
	respRows, err := DB.Query("SELECT id, merchant_id, name, price, message, created_at FROM order_responses WHERE order_id=?", id)
	if err == nil {
		defer respRows.Close()
		for respRows.Next() {
			var r model.OrderResponse
			if err := respRows.Scan(&r.ID, &r.MerchantID, &r.Name, &r.Price, &r.Message, &r.CreatedAt); err == nil {
				o.Responses = append(o.Responses, r)
			}
		}
	}
	if o.Responses == nil {
		o.Responses = []model.OrderResponse{}
	}
	return o, nil
}

func DeleteCustomOrder(id string) error {
	_, err := DB.Exec("DELETE FROM order_responses WHERE order_id=?", id)
	if err != nil {
		return err
	}
	_, err = DB.Exec("DELETE FROM custom_orders WHERE id=?", id)
	return err
}

func GetPublicOrders() ([]*model.CustomOrder, error) {
	rows, err := DB.Query("SELECT id, title, budget, policy, consumer_name, status, created_at FROM custom_orders WHERE status='active' ORDER BY created_at DESC")
	if err != nil { return nil, err }
	defer rows.Close()
	var orders []*model.CustomOrder
	for rows.Next() {
		o := &model.CustomOrder{}
		if err := rows.Scan(&o.ID, &o.Title, &o.Budget, &o.Policy, &o.ConsumerName, &o.Status, &o.CreatedAt); err != nil { return nil, err }
		o.Responses = []model.OrderResponse{}
		orders = append(orders, o)
	}
	if orders == nil { orders = []*model.CustomOrder{} }
	return orders, nil
}

func GetAllCustomOrders() ([]*model.CustomOrder, error) {
	rows, err := DB.Query("SELECT id, title, description, budget, policy, session_id, ciphertext, consumer_id, consumer_name, status, created_at FROM custom_orders ORDER BY created_at DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var orders []*model.CustomOrder
	for rows.Next() {
		o := &model.CustomOrder{}
		if err := rows.Scan(&o.ID, &o.Title, &o.Description, &o.Budget, &o.Policy, &o.SessionID, &o.Ciphertext, &o.ConsumerID, &o.ConsumerName, &o.Status, &o.CreatedAt); err != nil {
			return nil, err
		}
		o.Responses = []model.OrderResponse{}
		orders = append(orders, o)
	}
	return orders, nil
}

func AddOrderResponse(resp *model.OrderResponse) error {
	_, err := DB.Exec(
		"INSERT INTO order_responses (id, order_id, merchant_id, name, price, message) VALUES (?,?,?,?,?,?)",
		resp.ID, resp.MerchantID, resp.MerchantID, resp.Name, resp.Price, resp.Message,
	)
	return err
}

// Update order_responses: the OrderResponse model uses MerchantID as the ID field for the custom order.
// The actual merchant id is Name (merchant name). We need to store the order_id properly.
func AddOrderResponseProper(orderID string, resp *model.OrderResponse) error {
	_, err := DB.Exec(
		"INSERT INTO order_responses (id, order_id, merchant_id, name, price, message) VALUES (?,?,?,?,?,?)",
		resp.ID, orderID, resp.MerchantID, resp.Name, resp.Price, resp.Message,
	)
	return err
}

// ==================== Qualifications ====================

func CreateQualification(q *model.Qualification) error {
	_, err := DB.Exec(
		"INSERT INTO qualifications (id, holder_id, holder_name, qual_type, qual_value, status, certifier_id, certifier_name, expires_at) VALUES (?,?,?,?,?,?,?,?,?)",
		q.ID, q.HolderID, q.HolderName, q.Type, q.Value, q.Status, q.CertifierID, q.CertifierName, q.ExpiresAt,
	)
	return err
}

func GetQualificationsByHolder(holderID string) ([]model.Qualification, error) {
	rows, err := DB.Query(
		"SELECT id, holder_id, holder_name, qual_type, qual_value, status, certifier_id, certifier_name, IFNULL(issued_at,''), IFNULL(expires_at,'') FROM qualifications WHERE holder_id=? ORDER BY issued_at DESC",
		holderID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanQualifications(rows)
}

func GetAllQualifications() ([]model.Qualification, error) {
	rows, err := DB.Query("SELECT id, holder_id, holder_name, qual_type, qual_value, status, certifier_id, certifier_name, IFNULL(issued_at,''), IFNULL(expires_at,'') FROM qualifications ORDER BY issued_at DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanQualifications(rows)
}

func GetQualificationByID(id string) (*model.Qualification, error) {
	q := &model.Qualification{}
	err := DB.QueryRow(
		"SELECT id, holder_id, holder_name, qual_type, qual_value, status, certifier_id, certifier_name, IFNULL(issued_at,''), IFNULL(expires_at,'') FROM qualifications WHERE id=?",
		id,
	).Scan(&q.ID, &q.HolderID, &q.HolderName, &q.Type, &q.Value, &q.Status, &q.CertifierID, &q.CertifierName, &q.IssuedAt, &q.ExpiresAt)
	if err == sql.ErrNoRows { return nil, nil }
	return q, err
}

func GetPendingReviews() ([]model.Qualification, error) {
	rows, err := DB.Query("SELECT id, holder_id, holder_name, qual_type, qual_value, status, certifier_id, certifier_name, IFNULL(issued_at,''), IFNULL(expires_at,'') FROM qualifications WHERE status='pending' ORDER BY issued_at")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanQualifications(rows)
}

func scanQualifications(rows *sql.Rows) ([]model.Qualification, error) {
	var quals []model.Qualification
	for rows.Next() {
		var q model.Qualification
		if err := rows.Scan(&q.ID, &q.HolderID, &q.HolderName, &q.Type, &q.Value, &q.Status, &q.CertifierID, &q.CertifierName, &q.IssuedAt, &q.ExpiresAt); err != nil {
			return nil, err
		}
		quals = append(quals, q)
	}
	if quals == nil {
		quals = []model.Qualification{}
	}
	return quals, nil
}

func ApproveQualification(id, certifierID, certifierName string) error {
	_, err := DB.Exec(
		"UPDATE qualifications SET status='active', certifier_id=?, certifier_name=?, issued_at=NOW() WHERE id=?",
		certifierID, certifierName, id,
	)
	return err
}

func RejectQualification(id string) error {
	_, err := DB.Exec("UPDATE qualifications SET status='rejected' WHERE id=?", id)
	return err
}

func ExpireAllQualifications() error {
	_, err := DB.Exec("UPDATE qualifications SET status='expired' WHERE status='active'")
	return err
}

func RevokeQualification(id string) error {
	_, err := DB.Exec("UPDATE qualifications SET status='revoked' WHERE id=?", id)
	return err
}

func RenewQualification(id, newExpiry string) error {
	_, err := DB.Exec("UPDATE qualifications SET expires_at=?, status='active' WHERE id=?", newExpiry, id)
	return err
}

func RestoreQualification(id string) error {
	_, err := DB.Exec("UPDATE qualifications SET status='active' WHERE id=?", id)
	return err
}

// ==================== Archive ====================

func GetArchive(productID string) ([]model.ArchiveNode, error) {
	rows, err := DB.Query(
		"SELECT step, location, node_time, description, is_public FROM archive_nodes WHERE product_id=? ORDER BY id",
		productID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var nodes []model.ArchiveNode
	for rows.Next() {
		var n model.ArchiveNode
		if err := rows.Scan(&n.Step, &n.Location, &n.Time, &n.Desc, &n.Public); err != nil {
			return nil, err
		}
		nodes = append(nodes, n)
	}
	if nodes == nil {
		nodes = []model.ArchiveNode{}
	}
	// Fallback: return demo data if archive is empty
	if len(nodes) == 0 {
		nodes = getDemoArchive(productID)
	}
	return nodes, nil
}

func getDemoArchive(productID string) []model.ArchiveNode {
	demo := map[string][]model.ArchiveNode{
		"p1": {{Step:"种植",Location:"福建安溪茶园基地",Time:"2026-03-15 08:00",Desc:"春季新芽采摘，有机种植标准，土壤检测合格",Public:true},{Step:"加工",Location:"福建名品加工车间",Time:"2026-03-20 14:00",Desc:"传统工艺炒制，质检合格入库",Public:true},{Step:"质检",Location:"福建省茶叶检测中心",Time:"2026-04-01 10:00",Desc:"农残检测、重金属检测全部通过",Public:false},{Step:"运输",Location:"顺丰冷链枢纽",Time:"2026-04-05 09:00",Desc:"恒温冷链运输，全程GPS追踪",Public:false},{Step:"到店",Location:"品牌旗舰店",Time:"2026-04-10 16:00",Desc:"上架销售，扫码可追溯",Public:true}},
		"p2": {{Step:"种植",Location:"安溪铁观音种植基地",Time:"2026-02-10 07:00",Desc:"春季铁观音采摘",Public:true},{Step:"加工",Location:"安溪茶厂加工车间",Time:"2026-02-20 09:00",Desc:"半发酵工艺处理",Public:true},{Step:"质检",Location:"安溪质检中心",Time:"2026-03-01 14:00",Desc:"品质检测合格",Public:false},{Step:"运输",Location:"福建物流中心",Time:"2026-03-10 08:00",Desc:"标准物流运输",Public:false},{Step:"到店",Location:"全国茶叶专卖店",Time:"2026-03-15 10:00",Desc:"上架销售",Public:true}},
		"p4": {{Step:"种植",Location:"山东烟台苹果园",Time:"2026-04-01 06:00",Desc:"红富士苹果采摘，糖度检测达标",Public:true},{Step:"分选",Location:"烟台果品分选中心",Time:"2026-04-02 10:00",Desc:"自动化分选，按大小分级",Public:true},{Step:"质检",Location:"烟台质检站",Time:"2026-04-03 09:00",Desc:"农残检测合格",Public:false},{Step:"运输",Location:"山东冷链物流",Time:"2026-04-05 14:00",Desc:"冷链运输至全国",Public:false},{Step:"到店",Location:"全国超市",Time:"2026-04-10 08:00",Desc:"上架销售",Public:true}},
	}
	if nodes, ok := demo[productID]; ok {
		return nodes
	}
	// Generic demo for any product
	return []model.ArchiveNode{
		{Step:"种植",Location:"原产地农场",Time:"2026-03-15",Desc:"标准化种植流程",Public:true},
		{Step:"加工",Location:"加工车间",Time:"2026-03-20",Desc:"产品加工包装",Public:true},
		{Step:"质检",Location:"检测中心",Time:"2026-04-01",Desc:"质量检测通过（加密存储）",Public:false},
		{Step:"运输",Location:"物流中心",Time:"2026-04-05",Desc:"运输配送（加密存储）",Public:false},
		{Step:"到店",Location:"销售终端",Time:"2026-04-10",Desc:"上架销售可扫码追溯",Public:true},
	}
}

func AddArchiveNode(productID string, n *model.ArchiveNode) error {
	_, err := DB.Exec(
		"INSERT INTO archive_nodes (product_id, step, location, node_time, description, is_public) VALUES (?,?,?,?,?,?)",
		productID, n.Step, n.Location, n.Time, n.Desc, n.Public,
	)
	return err
}

// ==================== Demand Market ====================

func GetDemandMarket(merchantID string) ([]*model.CustomOrder, error) {
	// Get qualifications for this merchant
	quals, err := GetQualificationsByHolder(merchantID)
	if err != nil {
		return nil, err
	}
	// Get all active custom orders
	orders, err := GetAllCustomOrders()
	if err != nil {
		return nil, err
	}
	// Check matching: if merchant has matching qualification, mark as matched
	for _, o := range orders {
		o.Responses = nil // Don't leak responses
		if len(quals) > 0 && o.Policy != "" {
			matched := false
			for _, q := range quals {
				if q.Status == "active" && strings.Contains(o.Policy, q.Type+"="+q.Value) {
					matched = true
					break
				}
			}
			// Inject a virtual "matched" field by setting a response
			if matched {
				o.Responses = []model.OrderResponse{{ID: "matched"}}
			}
		}
	}
	return orders, nil
}

// ==================== Seed Data ====================

func SeedDemoData() {
	// Check each table independently
	userCount := 0
	prodCount := 0
	qualCount := 0
	DB.QueryRow("SELECT COUNT(*) FROM users").Scan(&userCount)
	DB.QueryRow("SELECT COUNT(*) FROM products").Scan(&prodCount)
	DB.QueryRow("SELECT COUNT(*) FROM qualifications").Scan(&qualCount)

	if userCount > 0 && prodCount > 0 && qualCount > 0 {
		log.Println("[Seed] 数据已完整，跳过种子导入")
		return
	}
	log.Printf("[Seed] 导入数据 (users:%d→8, products:%d→28, quals:%d→7)", userCount, prodCount, qualCount)

	// Demo users (skip if exist)
	if userCount == 0 {
		users := []model.User{
		{ID: "u1", Username: "zhangguonong", Password: "123456", Name: "张果农", Role: "consumer", Location: "福建"},
		{ID: "u2", Username: "fujianmingpin", Password: "123456", Name: "福建名品茶厂", Role: "merchant", Location: "福建"},
		{ID: "u3", Username: "shandongfengshou", Password: "123456", Name: "山东丰收食品厂", Role: "merchant", Location: "山东"},
		{ID: "u4", Username: "zhejianglongjing", Password: "123456", Name: "浙江龙井茶园", Role: "merchant", Location: "浙江"},
		{ID: "u5", Username: "fujiangongshang", Password: "123456", Name: "福建省工商认证中心", Role: "certifier", Location: "福建"},
		{ID: "u6", Username: "youjirenzheng", Password: "123456", Name: "有机食品认证协会", Role: "certifier", Location: "北京"},
		{ID: "u7", Username: "admin", Password: "admin123", Name: "平台管理员", Role: "admin", Location: ""},
		{ID: "u8", Username: "shiyaojian", Password: "123456", Name: "食品药品监管局", Role: "regulator", Location: "北京"},
		{ID: "u9", Username: "caoyuanmuye", Password: "123456", Name: "草原牧业", Role: "merchant", Location: "内蒙古"},
	}
	for i := range users {
		CreateUser(&users[i])
	}
	}

	// Demo qualifications (skip if exist)
	if qualCount == 0 {
	quals := []model.Qualification{
		{ID: "q1", HolderID: "u2", HolderName: "福建名品茶厂", Type: "Location", Value: "福建", Status: "active", CertifierID: "u5", CertifierName: "福建省工商认证中心", ExpiresAt: "2027-01-01"},
		{ID: "q2", HolderID: "u2", HolderName: "福建名品茶厂", Type: "Capability", Value: "制茶", Status: "active", CertifierID: "u5", CertifierName: "福建省工商认证中心", ExpiresAt: "2027-01-01"},
		{ID: "q3", HolderID: "u2", HolderName: "福建名品茶厂", Type: "Grade", Value: "3", Status: "active", CertifierID: "u6", CertifierName: "有机食品认证协会", ExpiresAt: "2026-08-01"},
		{ID: "q4", HolderID: "u3", HolderName: "山东丰收食品厂", Type: "Location", Value: "山东", Status: "active", CertifierID: "u5", CertifierName: "福建省工商认证中心", ExpiresAt: "2027-01-01"},
		{ID: "q5", HolderID: "u3", HolderName: "山东丰收食品厂", Type: "Quality", Value: "有机", Status: "pending"},
		{ID: "q6", HolderID: "u4", HolderName: "浙江龙井茶园", Type: "Location", Value: "浙江", Status: "active", CertifierID: "u6", CertifierName: "有机食品认证协会", ExpiresAt: "2027-01-01"},
		{ID: "q7", HolderID: "u4", HolderName: "浙江龙井茶园", Type: "Quality", Value: "有机", Status: "active", CertifierID: "u6", CertifierName: "有机食品认证协会", ExpiresAt: "2026-09-01"},
	}
	for i := range quals {
		CreateQualification(&quals[i])
	}
	}

	// Demo products (28 items, skip if exist)
	if prodCount == 0 {
	products := []model.Product{
		{ID: "p1", Name: "武夷山大红袍", Category: "茶叶", Origin: "福建", Price: 388, Certification: "有机", Traceable: true, ShopID: "u2", ShopName: "福建名品茶厂"},
		{ID: "p2", Name: "安溪铁观音", Category: "茶叶", Origin: "福建", Price: 268, Certification: "地理标志", Traceable: true, ShopID: "u2", ShopName: "福建名品茶厂"},
		{ID: "p3", Name: "云南野生菌菇礼盒", Category: "菌菇", Origin: "云南", Price: 168, Certification: "绿色", Traceable: true, ShopID: "u3", ShopName: "山东丰收食品厂"},
		{ID: "p4", Name: "烟台红富士苹果", Category: "果蔬", Origin: "山东", Price: 59.9, Certification: "无公害", Traceable: true, ShopID: "u3", ShopName: "山东丰收食品厂"},
		{ID: "p5", Name: "西湖龙井绿茶", Category: "茶叶", Origin: "浙江", Price: 298, Certification: "有机", Traceable: true, ShopID: "u4", ShopName: "浙江龙井茶园"},
		{ID: "p6", Name: "有机五常大米", Category: "谷物", Origin: "黑龙江", Price: 89.9, Certification: "有机", Traceable: true, ShopID: "u2", ShopName: "福建名品茶厂"},
		{ID: "p7", Name: "长白山椴树蜜", Category: "蜂蜜", Origin: "吉林", Price: 128, Certification: "绿色", Traceable: true, ShopID: "u3", ShopName: "山东丰收食品厂"},
		{ID: "p8", Name: "内蒙古风干牛肉", Category: "畜牧", Origin: "内蒙古", Price: 99, Certification: "无公害", Traceable: true, ShopID: "u9", ShopName: "草原牧业"},
		{ID: "p9", Name: "黄山毛峰", Category: "茶叶", Origin: "安徽", Price: 328, Certification: "地理标志", Traceable: true, ShopID: "u2", ShopName: "福建名品茶厂"},
		{ID: "p10", Name: "普洱茶饼", Category: "茶叶", Origin: "云南", Price: 598, Certification: "有机", Traceable: true, ShopID: "u4", ShopName: "浙江龙井茶园"},
		{ID: "p11", Name: "福鼎白茶", Category: "茶叶", Origin: "福建", Price: 258, Certification: "绿色", Traceable: true, ShopID: "u2", ShopName: "福建名品茶厂"},
		{ID: "p12", Name: "新疆哈密瓜", Category: "果蔬", Origin: "新疆", Price: 39.9, Certification: "无公害", Traceable: true, ShopID: "u3", ShopName: "山东丰收食品厂"},
		{ID: "p13", Name: "赣南脐橙", Category: "果蔬", Origin: "江西", Price: 49.9, Certification: "绿色", Traceable: true, ShopID: "u3", ShopName: "山东丰收食品厂"},
		{ID: "p14", Name: "海南金煌芒果", Category: "果蔬", Origin: "海南", Price: 68, Certification: "无公害", Traceable: true, ShopID: "u4", ShopName: "浙江龙井茶园"},
		{ID: "p15", Name: "吐鲁番无核白葡萄", Category: "果蔬", Origin: "新疆", Price: 45, Certification: "绿色", Traceable: true, ShopID: "u3", ShopName: "山东丰收食品厂"},
		{ID: "p16", Name: "东北黑米", Category: "谷物", Origin: "黑龙江", Price: 35, Certification: "有机", Traceable: true, ShopID: "u2", ShopName: "福建名品茶厂"},
		{ID: "p17", Name: "宁夏枸杞", Category: "谷物", Origin: "宁夏", Price: 78, Certification: "地理标志", Traceable: true, ShopID: "u4", ShopName: "浙江龙井茶园"},
		{ID: "p18", Name: "山西沁州黄小米", Category: "谷物", Origin: "山西", Price: 42, Certification: "绿色", Traceable: true, ShopID: "u3", ShopName: "山东丰收食品厂"},
		{ID: "p19", Name: "西藏牦牛肉干", Category: "畜牧", Origin: "西藏", Price: 158, Certification: "有机", Traceable: true, ShopID: "u9", ShopName: "草原牧业"},
		{ID: "p20", Name: "金华火腿", Category: "畜牧", Origin: "浙江", Price: 288, Certification: "地理标志", Traceable: true, ShopID: "u4", ShopName: "浙江龙井茶园"},
		{ID: "p21", Name: "宁夏盐池滩羊肉", Category: "畜牧", Origin: "宁夏", Price: 198, Certification: "有机", Traceable: true, ShopID: "u9", ShopName: "草原牧业"},
		{ID: "p22", Name: "云南鲜花饼", Category: "零食", Origin: "云南", Price: 68, Certification: "绿色", Traceable: true, ShopID: "u4", ShopName: "浙江龙井茶园"},
		{ID: "p23", Name: "天津十八街麻花", Category: "零食", Origin: "天津", Price: 35, Certification: "无公害", Traceable: true, ShopID: "u3", ShopName: "山东丰收食品厂"},
		{ID: "p24", Name: "鲁花压榨花生油", Category: "粮油", Origin: "山东", Price: 128, Certification: "绿色", Traceable: true, ShopID: "u3", ShopName: "山东丰收食品厂"},
		{ID: "p25", Name: "四川汉源花椒油", Category: "粮油", Origin: "四川", Price: 58, Certification: "地理标志", Traceable: true, ShopID: "u4", ShopName: "浙江龙井茶园"},
		{ID: "p26", Name: "东北黑木耳", Category: "菌菇", Origin: "黑龙江", Price: 88, Certification: "有机", Traceable: true, ShopID: "u2", ShopName: "福建名品茶厂"},
		{ID: "p27", Name: "古田银耳", Category: "菌菇", Origin: "福建", Price: 68, Certification: "绿色", Traceable: true, ShopID: "u2", ShopName: "福建名品茶厂"},
		{ID: "p28", Name: "秦岭土蜂蜜", Category: "蜂蜜", Origin: "陕西", Price: 168, Certification: "有机", Traceable: true, ShopID: "u3", ShopName: "山东丰收食品厂"},
	}
	for i := range products {
		CreateProduct(&products[i])
	}
	}

	log.Println("[Seed] 导入完成")
}

// Debug helper
func PrintStats() {
	var users, prods, orders, quals int
	DB.QueryRow("SELECT COUNT(*) FROM users").Scan(&users)
	DB.QueryRow("SELECT COUNT(*) FROM products").Scan(&prods)
	DB.QueryRow("SELECT COUNT(*) FROM custom_orders").Scan(&orders)
	DB.QueryRow("SELECT COUNT(*) FROM qualifications").Scan(&quals)
	log.Printf("[Stats] Users:%d Products:%d Orders:%d Qualifications:%d", users, prods, orders, quals)
}

func init() {
	// Suppress unused import warning for fmt in debug
	_ = fmt.Sprintf
}
