# 隐农链 — API 接口文档

**Base URL**: `http://localhost:8080`

---

## 认证

### 登录
```
POST /api/auth/login
```
请求：
```json
{ "username": "admin", "password": "admin123" }
```
响应：
```json
{
  "status": "success",
  "user": { "id": "ad01", "username": "admin", "name": "平台管理员", "role": "admin", "location": "北京" },
  "token": "token_admin_ad01"
}
```

### 注册
```
POST /api/auth/register
```
请求：
```json
{
  "username": "newuser",
  "password": "123456",
  "name": "新用户",
  "role": "consumer",
  "phone": "13800000000",
  "location": "北京"
}
```

---

## 商品

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/products` | 商品列表（支持 ?keyword=&category=&origin= 筛选） |
| GET | `/api/products/:id` | 商品详情 |
| GET | `/api/my-products?shop_id=` | 商家自己的商品 |
| POST | `/api/products` | 发布新商品 |

### 发布商品
```json
{
  "name": "有机铁观音",
  "category": "茶叶",
  "origin": "福建安溪",
  "price": 288,
  "certification": "有机",
  "traceable": true,
  "shop_id": "m01",
  "shop_name": "福建茗品茶厂",
  "image": "🍵"
}
```

---

## 产品档案

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/archive/:productId?role=` | 产品追溯档案（regulator/admin 看全部，其他看公开节点） |

---

## 定制需求 ⭐ (ABE 核心)

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/custom-order` | 发布定制需求（ABE 加密） |
| GET | `/api/custom-orders?consumer_id=` | 我的定制列表 |
| GET | `/api/custom-orders/:id` | 定制详情 |
| POST | `/api/custom-orders/:id/respond` | 工厂响应定制 |

### 发布定制
```json
{
  "title": "牛奶味茶饼定制",
  "description": "需要福建工厂制作牛奶味茶饼",
  "budget": "5000-10000",
  "conditions": { "Location": "福建", "Capability": "制茶" },
  "consumer_id": "c01"
}
```
响应：
```json
{
  "status": "success",
  "message": "定制需求已定向发布",
  "data": { "id": "CO001", "policy": "(Location=福建, Capability=制茶; 2)", ... },
  "policy_tip": "产地要求：福建 | 加工能力：制茶"
}
```

### 工厂响应定制
```json
{
  "merchant_id": "m01",
  "name": "福建茗品茶厂",
  "price": "8000元",
  "message": "我们专业制茶30年"
}
```

---

## 需求市场 ⭐ (ABE 匹配)

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/demand-market?merchant_id=` | 根据资质匹配的需求 |

响应中每项包含：
- `matched: true/false` — 是否完全匹配
- `match_details` — 逐条件对比（要求 vs 现有）
- `can_view: true/false` — 是否可查看详情
- `description` — 匹配时显示完整描述，不匹配时显示"🔒 不具备查看资质"

---

## 资质管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/my-qualifications?holder_id=` | 我的资质列表 |
| POST | `/api/qualifications/apply` | 申请新资质 |

### 申请资质
```json
{
  "holder_id": "m01",
  "holder_name": "福建茗品茶厂",
  "type": "Location",
  "value": "福建",
  "evidence": "营业执照"
}
```

---

## 审核方

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/review-list` | 待审核列表 |
| POST | `/api/review/:id/approve` | 审批通过 |
| POST | `/api/review/:id/reject` | 驳回申请 |
| POST | `/api/qualifications/:id/revoke` | 收回资质 |

---

## 管理员

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/users` | 全部用户 |
| GET | `/api/admin/qualifications` | 全部资质 |
| GET | `/api/admin/orders` | 全部定制需求 |
| POST | `/api/admin/sys-update` | 更新平台认证规则 |

---

## 监管方

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/regulator/search?keyword=` | 产品档案搜索 |
| POST | `/api/regulator/emergency` | 应急解密 |

### 应急解密
```json
{ "product_id": "P001" }
```

---

## 错误码

| 状态码 | 含义 |
|--------|------|
| 200 | 成功 |
| 400 | 参数错误 |
| 401 | 用户名或密码错误 |
| 404 | 资源不存在 |
| 409 | 用户名已存在 |
| 500 | 服务端错误 |
