package repository

import (
	"database/sql"
	"fruit_backend/internal/model"
)

// ==================== Orders ====================

func CreateOrder(o *model.Order) error {
	_, err := DB.Exec(
		`INSERT INTO orders (id, consumer_id, consumer_name, merchant_id, product_id, product_name, quantity, price, total, status, remark)
		 VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
		o.ID, o.ConsumerID, o.ConsumerName, o.MerchantID, o.ProductID, o.ProductName,
		o.Quantity, o.Price, o.Total, o.Status, o.Remark,
	)
	return err
}

func GetOrdersByMerchant(merchantID string) ([]model.Order, error) {
	rows, err := DB.Query(
		`SELECT id, consumer_id, consumer_name, merchant_id, product_id, product_name,
		        quantity, price, total, status, IFNULL(remark,''), created_at
		 FROM orders WHERE merchant_id=? ORDER BY created_at DESC`, merchantID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanOrders(rows)
}

func GetOrdersByConsumer(consumerID string) ([]model.Order, error) {
	rows, err := DB.Query(
		`SELECT id, consumer_id, consumer_name, merchant_id, product_id, product_name,
		        quantity, price, total, status, IFNULL(remark,''), created_at
		 FROM orders WHERE consumer_id=? ORDER BY created_at DESC`, consumerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanOrders(rows)
}

func GetAllOrders() ([]model.Order, error) {
	rows, err := DB.Query(
		`SELECT id, consumer_id, consumer_name, merchant_id, product_id, product_name,
		        quantity, price, total, status, IFNULL(remark,''), created_at
		 FROM orders ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanOrders(rows)
}

func UpdateOrderStatus(orderID, status string) error {
	_, err := DB.Exec("UPDATE orders SET status=? WHERE id=?", status, orderID)
	return err
}

func CountOrders() int {
	var count int
	DB.QueryRow("SELECT COUNT(*) FROM orders").Scan(&count)
	return count
}

func scanOrders(rows *sql.Rows) ([]model.Order, error) {
	var orders []model.Order
	for rows.Next() {
		var o model.Order
		if err := rows.Scan(&o.ID, &o.ConsumerID, &o.ConsumerName, &o.MerchantID,
			&o.ProductID, &o.ProductName, &o.Quantity, &o.Price, &o.Total,
			&o.Status, &o.Remark, &o.CreatedAt); err != nil {
			return nil, err
		}
		orders = append(orders, o)
	}
	if orders == nil {
		orders = []model.Order{}
	}
	return orders, nil
}
