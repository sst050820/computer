# 隐农链 — 系统架构文档

## 概述

隐农链是基于**属性基加密（ABE）**和**区块链**的智慧农业隐私追溯平台。核心创新在于将 ABE 的访问控制能力融入农产品定制需求匹配场景，实现"谁满足条件谁才能看到"的定向可见机制。

## 系统架构

```
┌──────────────────────────────────────────────────┐
│              浏览器 (SPA 单页应用)                 │
│         http://localhost:8080                    │
│     index.html + app.js + pages.js               │
└──────────────────┬───────────────────────────────┘
                   │ REST API (JSON)
┌──────────────────▼───────────────────────────────┐
│           Go 后端 (Gin 框架 :8080)                │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ handler/ │→│ service/ │→│ repository/   │  │
│  │ 9 files  │  │ ABE集成   │  │ Fabric/MySQL  │  │
│  └──────────┘  └──────────┘  └───────────────┘  │
│  model/  ←→  middleware/  ←→  router/           │
└──────┬───────────────────────┬───────────────────┘
       │                       │
┌──────▼──────────┐  ┌─────────▼───────────────────┐
│ Java ABE 服务    │  │ Hyperledger Fabric 2.3      │
│ :8081           │  │ Chaincode: traceability      │
│ MAFASAC-AR 方案  │  │ CreateFruit / QueryFruit     │
│ 复合阶双线性群   │  │ 不可篡改账本                  │
└─────────────────┘  └─────────────────────────────┘
```

## 目录结构

```
program/
├── frontend/                 # 前端 SPA (14 JS files)
│   ├── index.html            # SPA 入口 + 登录/注册页
│   ├── css/
│   │   ├── app.css           # 主样式 (7KB)
│   │   └── common.css        # 原样式
│   └── js/
│       ├── utils.js          # 工具函数
│       ├── api.js            # API 请求层 (20+接口)
│       ├── app.js            # 应用路由 + 登录逻辑
│       ├── components/       # 3 个 UI 组件
│       │   ├── product-card.js
│       │   ├── condition-selector.js    # ABE 条件选择器
│       │   └── qualification-tags.js   # 资质标签
│       └── pages/
│           ├── pages.js               # 46 个页面渲染器
│           ├── consumer/              # 消费者页面
│           ├── merchant/              # 商家页面
│           ├── certifier/             # 审核方页面
│           ├── admin/                 # 管理员页面
│           └── regulator/             # 监管方页面
│
├── backend/                  # Go 后端 (16 Go files)
│   ├── main.go               # 入口
│   └── internal/
│       ├── handler/          # 9 个 HTTP 处理器
│       │   ├── auth.go       # 登录/注册
│       │   ├── product.go    # 商品
│       │   ├── custom_order.go    # 定制需求 (ABE加密)
│       │   ├── demand_market.go   # 需求市场 (ABE匹配)
│       │   ├── qualification.go   # 资质管理
│       │   ├── certifier.go  # 审核方
│       │   ├── admin.go      # 管理员
│       │   ├── regulator.go  # 监管方
│       │   └── archive.go    # 产品档案
│       ├── service/
│       │   └── abe_service.go # ABE 加解密 + 策略转换
│       ├── repository/       # Fabric/MySQL/Redis
│       ├── model/            # 数据模型 + 种子数据
│       ├── middleware/       # CORS 中间件
│       └── router/           # 路由注册 + Fabric 初始化
│
├── chaincode/                # Fabric 链码
│   ├── main.go
│   ├── handler/              # CreateFruit / InitLedger
│   └── model/                # 链上数据模型
│
├── crypto_service/           # Java ABE 加密服务
│   ├── CryptoServer.java     # HTTP 服务 (:8081)
│   ├── java/MAFASACAR/       # 密码算法实现
│   ├── lib/                  # JPBC 依赖
│   └── params/               # 椭圆曲线参数
│
├── scripts/                  # 6 个运维脚本
├── deploy/                   # Nginx 配置
├── docs/                     # 项目文档
└── logs/                     # 运行日志
```

## 数据流

### 定制需求发布（ABE 加密）
```
前端 ConditionSelector → 条件 {Location:福建, Capability:制茶}
  → API.createCustomOrder()
  → Go handler.HandleCreateCustomOrder()
  → service.ConditionToPolicy() → "(Location=福建, Capability=制茶; 2)"
  → service.EncryptWithABE() → Java CryptoServer.encrypt()
  → 返回 sessionID + 密文
  → 存入内存 + Fabric 上链
```

### 需求市场查询（ABE 匹配）
```
商家登录 → API.getDemandMarket(merchant_id)
  → Go handler.HandleGetDemandMarket()
  → 获取商家资质列表
  → 遍历所有活跃定制需求
  → 比对条件与资质
  → 匹配 → 显示完整内容
  → 不匹配 → 显示"🔒 不具备查看资质"
```

## 技术选型

| 组件 | 技术 | 理由 |
|------|------|------|
| 前端 | 原生 HTML/CSS/JS | 无框架依赖，快速部署 |
| 后端 | Go + Gin | 高性能、静态编译 |
| 密码学 | Java + JPBC | JPBC 是标准双线性配对库 |
| 区块链 | Hyperledger Fabric | 企业级许可链 |
| ABE 方案 | MAFASAC-AR | 多授权方 + 属性撤销 |
