# 农禾坊 — API 接口文档

**Base URL**: `http://localhost:8080`

---

## 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 登录 |
| POST | `/api/auth/register` | 注册 |

---

## 用户

| 方法 | 路径 | 说明 |
|------|------|------|
| PUT | `/api/user/profile` | 更新个人信息 |

---

## 商品

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/products?keyword=&category=&origin=` | 商品列表 |
| GET | `/api/products/:id` | 商品详情 |
| GET | `/api/my-products?shop_id=` | 商家商品 |
| POST | `/api/products` | 发布商品 |
| DELETE | `/api/products/:id` | 下架商品 |

---

## 产品档案

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/archive/:productId?role=` | 追溯档案 |

---

## 定制需求 (ABE 核心)

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/custom-order` | 发布需求（ABE 加密） |
| GET | `/api/custom-orders?consumer_id=` | 我的需求列表 |
| GET | `/api/custom-orders/:id` | 需求详情 |
| POST | `/api/custom-orders/:id/respond` | 商家响应 |
| DELETE | `/api/custom-orders/:id` | 删除需求 |
| **POST** | **`/api/custom-orders/:id/decrypt`** | **ABE 解密验证** |
| GET | `/api/public-orders` | 公开需求列表 |

---

## 购买订单

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/orders` | 创建订单 |
| GET | `/api/merchant/orders?merchant_id=` | 商家订单 |
| GET | `/api/consumer/orders?consumer_id=` | 消费者订单 |
| PUT | `/api/orders/:id/status` | 更新订单状态 |

---

## 需求市场

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/demand-market?merchant_id=` | 资质匹配需求 |

---

## 资质管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/my-qualifications?holder_id=` | 我的资质 |
| POST | `/api/qualifications/apply` | 申请资质 |
| POST | `/api/qualifications/:id/revoke` | 收回（触发 ABE 撤销） |
| PUT | `/api/qualifications/:id/renew` | 续期 |
| PUT | `/api/qualifications/:id/restore` | 恢复 |

---

## 审核方

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/review-list` | 待审核列表 |
| POST | `/api/review/:id/approve` | 审批通过 |
| POST | `/api/review/:id/reject` | 驳回 |

---

## 管理员

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/users` | 全部用户 |
| DELETE | `/api/admin/users/:id` | 删除用户（仅消费者/商家） |
| GET | `/api/admin/qualifications` | 全部资质 |
| GET | `/api/admin/orders` | 全部定制需求 |
| **POST** | **`/api/admin/sys-update`** | **系统规则更新（触发 ABE 密钥轮换）** |

---

## 监管方

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/regulator/search?keyword=` | 档案搜索（支持ID+名称） |
| POST | `/api/regulator/emergency` | 应急解密 |

---

## ABE 服务端点

| 方法 | Java 服务路径 | 说明 | Go 函数 |
|------|-------------|------|---------|
| POST | `/api/encrypt` | ABE 加密 | `EncryptWithABE` |
| POST | `/api/decrypt` | ABE 解密验证 | `DecryptWithABE` |
| POST | `/api/revoke` | 属性撤销 | `RevokeAttribute` |
| POST | `/api/rekey` | 系统密钥轮换 | `UpdateSystemKeys` |
| POST | `/api/reencrypt` | 重新加密 | `ReEncryptContent` |

---

## 降级策略

| 场景 | 行为 |
|------|------|
| Java ABE 服务不可用 | 加密返回明文，解密用属性字符串匹配 |
| ABE 撤销失败 | DB 标记 revoked + 提示"系统密钥更新后生效" |
| ABE 密钥轮换失败 | 仅 DB 将所有资质标记 expired |

---

## 完整路由表（40条）

```
POST   /api/auth/login
POST   /api/auth/register
PUT    /api/user/profile
GET    /api/products
GET    /api/products/:id
GET    /api/my-products
POST   /api/products
DELETE /api/products/:id
GET    /api/archive/:productId
POST   /api/custom-order
GET    /api/custom-orders
GET    /api/custom-orders/:id
POST   /api/custom-orders/:id/respond
DELETE /api/custom-orders/:id
POST   /api/custom-orders/:id/decrypt
GET    /api/public-orders
POST   /api/orders
GET    /api/merchant/orders
GET    /api/consumer/orders
PUT    /api/orders/:id/status
GET    /api/demand-market
GET    /api/my-qualifications
POST   /api/qualifications/apply
POST   /api/qualifications/:id/revoke
PUT    /api/qualifications/:id/renew
PUT    /api/qualifications/:id/restore
GET    /api/review-list
POST   /api/review/:id/approve
POST   /api/review/:id/reject
GET    /api/admin/users
DELETE /api/admin/users/:id
GET    /api/admin/qualifications
GET    /api/admin/orders
POST   /api/admin/sys-update
GET    /api/regulator/search
POST   /api/regulator/emergency
```
