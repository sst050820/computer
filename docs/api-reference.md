# 农禾坊 — API 接口文档

**Base URL**: `http://localhost:8080`

---

## 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 登录（username+password 或 role） |
| POST | `/api/auth/register` | 注册 |

---

## 商品

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/products?keyword=&category=&origin=` | 商品列表（筛选） |
| GET | `/api/products/:id` | 商品详情 |
| GET | `/api/my-products?shop_id=` | 商家自己的商品 |
| POST | `/api/products` | 发布新商品 |

---

## 产品档案

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/archive/:productId?role=` | 追溯档案（regulator/admin 完整，其他公开节点） |

---

## 定制需求

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/custom-order` | 发布定制需求 |
| GET | `/api/custom-orders?consumer_id=` | 我的需求列表 |
| GET | `/api/custom-orders/:id` | 需求详情 |
| POST | `/api/custom-orders/:id/respond` | 商家响应 |
| DELETE | `/api/custom-orders/:id` | 删除需求 |

---

## 购买订单

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/orders` | 创建订单（从购物车结算） |
| GET | `/api/merchant/orders?merchant_id=` | 商家查看订单 |
| GET | `/api/consumer/orders?consumer_id=` | 消费者查看订单 |
| PUT | `/api/orders/:id/status` | 更新订单状态 |

订单状态流转：`pending → confirmed → shipped → delivered → completed`（可随时 → `cancelled`）

---

## 需求市场

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/demand-market?merchant_id=` | 根据资质匹配的需求 |

---

## 资质管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/my-qualifications?holder_id=` | 我的资质 |
| POST | `/api/qualifications/apply` | 申请新资质 |

---

## 审核方

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/review-list` | 待审核列表 |
| POST | `/api/review/:id/approve` | 审批通过 |
| POST | `/api/review/:id/reject` | 驳回 |
| POST | `/api/qualifications/:id/revoke` | 收回资质 |
| PUT | `/api/qualifications/:id/renew` | 续期资质 `{"expires_at":"2027-12-31"}` |
| PUT | `/api/qualifications/:id/restore` | 恢复资质 |

---

## 管理员

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/users` | 全部用户 |
| GET | `/api/admin/qualifications` | 全部资质 |
| GET | `/api/admin/orders` | 全部定制需求 |
| POST | `/api/admin/sys-update` | 更新认证规则 |

---

## 监管方

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/regulator/search?keyword=` | 档案搜索 |
| POST | `/api/regulator/emergency` | 应急解密 |

---

## 30+ API 全览

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/products
GET    /api/products/:id
GET    /api/my-products
POST   /api/products
GET    /api/archive/:productId
POST   /api/custom-order
GET    /api/custom-orders
GET    /api/custom-orders/:id
POST   /api/custom-orders/:id/respond
DELETE /api/custom-orders/:id
POST   /api/orders
GET    /api/merchant/orders
GET    /api/consumer/orders
PUT    /api/orders/:id/status
GET    /api/demand-market
GET    /api/my-qualifications
POST   /api/qualifications/apply
GET    /api/review-list
POST   /api/review/:id/approve
POST   /api/review/:id/reject
POST   /api/qualifications/:id/revoke
PUT    /api/qualifications/:id/renew
PUT    /api/qualifications/:id/restore
GET    /api/admin/users
GET    /api/admin/qualifications
GET    /api/admin/orders
POST   /api/admin/sys-update
GET    /api/regulator/search
POST   /api/regulator/emergency
```
