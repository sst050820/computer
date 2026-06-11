# 农禾坊 — 系统架构

## 架构图

```
浏览器 (Vue 3 SPA)
    │
    ├── /index.html → Vue 3 App Shell (登录/注册/主布局)
    ├── /css/app.css → 森林绿设计系统 (900行)
    ├── /js/vue-app.js → 主应用 (reactive state, router, cart, auth)
    ├── /js/pages/vue/ → 27 页面组件
    ├── /js/components/ → 12 组件 (9 Base + 3 业务)
    └── /js/api.js → API 客户端 (20+ methods)

    │ HTTP (Gin, 40 routes)
    ▼
Go 后端 (:8080)
    ├── handler/    → 11 处理器 (34 handler函数)
    ├── service/    → ABE 加解密/撤销/密钥轮换
    ├── repository/ → MySQL 数据访问 (600+ lines)
    ├── model/      → 数据模型
    ├── middleware/  → CORS
    └── router/     → 40 API 路由

    │ SQL
    ▼
MySQL 8.0 (Docker: mysql-fruit)
    ├── users (9)
    ├── products (28)
    ├── qualifications (7)
    ├── custom_orders + order_responses
    ├── orders
    └── archive_nodes

    │ (可选) HTTP :8081
    ▼
Java ABE 服务 (JPBC + MAFASAC-AR)
    ├── POST /api/encrypt
    ├── POST /api/decrypt
    ├── POST /api/revoke
    ├── POST /api/rekey
    └── POST /api/reencrypt

    │ (可选) gRPC
    ▼
Hyperledger Fabric 2.3
    └── traceability chaincode
```

## 前端

- **框架**: Vue 3 CDN（无构建工具，运行时模板编译）
- **设计**: 森林绿 `#2D6A4F` + 暖土中性色，8px 网格
- **组件**: 9 Base + 3 业务 + 27 页面 = 39 组件
- **状态**: `App` 全局对象 + `Vue.reactive` 购物车
- **持久化**: localStorage（session/cart/messages 按用户隔离）+ MySQL（业务数据）
- **路由**: 自定义 hash-free SPA 路由（`window.navigateTo`）

## 后端

- **框架**: Go + Gin，40 条 API 路由
- **数据库**: MySQL 8.0，`database/sql` + `go-sql-driver/mysql`
- **种子**: 9 用户 + 28 商品 + 7 资质（按表检测，缺失自动补）
- **ABE 服务**: Java JPBC，5 个端点

## ABE 数据流

```
消费者发布需求
  → 条件 → ConditionToPolicy → ABE策略字符串
  → EncryptWithABE(描述) → Java /api/encrypt → 密文
  → 存储到 MySQL custom_orders

商家查看需求
  → POST /api/custom-orders/:id/decrypt + 商家ID
  → 获取商家资质 → DecryptWithABE(密文, 资质) → Java /api/decrypt
  → 成功返回原文 | 失败降级 MatchAttributes

审核方收回资质
  → DB: status='revoked' + ABE: RevokeAttribute → Java /api/revoke

管理员更新规则
  → ABE: UpdateSystemKeys → Java /api/rekey + DB: ExpireAllQualifications
```

## 部署

```bash
make start    # 一键启动（MySQL + 后端）
make stop     # 停止
make clean    # 清理
```
