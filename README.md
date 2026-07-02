# 农禾坊 — 智慧农业隐私追溯平台

基于**属性基加密（ABE）**和**区块链**的农产品隐私追溯平台——消费者用加密条件发布需求，只有持有匹配资质的商家才能解密查看。

## 快速开始

```bash
# 1. 启动 MySQL（Docker）
docker start mysql-fruit 2>/dev/null || docker run -d --name mysql-fruit \
  -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=fruit_platform \
  -p 3306:3306 mysql:8.0 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

# 2. 启动 Java ABE 密码学服务 (:8081)
cd ~/program/crypto_service
java -cp "lib/*:classes" CryptoServer &

# 3. 启动 Go 后端 (:8080)
cd ~/program/backend
go build -o server . && nohup ./server > /tmp/server.log 2>&1 &

# 4. 浏览器访问 http://localhost:8080
```

## 账号

### 消费者
| 用户名 | 密码 | 姓名 |
|--------|------|------|
| `shike` | `123456` | 陈食客 |

### 商家（9 个福建市级商家，密码均为 `123456`）

| 用户名 | 商家名 | 地区 | 产品数 |
|--------|--------|------|--------|
| `sanming` | 三明农产品 | 三明（含大田、建宁） | 5 |
| `nanping` | 南平农产品 | 南平（含武夷山、建阳） | 4 |
| `ningde` | 宁德农产品 | 宁德（含福安、屏南、古田） | 3 |
| `fuzhou` | 福州农产品 | 福州（含永泰、闽清） | 5 |
| `longyan` | 龙岩农产品 | 龙岩 | 2 |
| `putian` | 莆田农产品 | 莆田 | 3 |
| `quanzhou` | 泉州农产品 | 泉州（含安溪） | 1 |
| `zhangzhou` | 漳州农产品 | 漳州（含平和） | 5 |
| `xiamen` | 厦门农产品 | 厦门 | 2 |

### 审核方、管理员、监管方

| 角色 | 用户名 | 密码 | 管辖 |
|------|--------|------|------|
| 🏛️ 审核方 | `fujiangongshang` | `123456` | Location、Grade |
| 🏛️ 审核方 | `youjirenzheng` | `123456` | Quality、Capability、Organic |
| ⚙️ 管理员 | `admin` | `admin123` | 全局管理 |
| 🔍 监管方 | `shiyaojian` | `123456` | 追溯审查、应急解密 |

## 技术栈

| 层 | 技术 | 说明 |
|----|------|------|
| 前端 | Vue 3 CDN + 原生 HTML/CSS/JS | 无构建工具 SPA，28 个页面组件 |
| 后端 | Go 1.25+ + Gin | ~45 条 API 路由 |
| 数据库 | MySQL 8.0（Docker） | 21 用户 + 30 商品 + 21 资质 |
| 密码学 | Java 17 + JPBC | MAFASAC-AR，复合阶双线性群 |
| 区块链 | Hyperledger Fabric 2.3 | 追溯链码（可选组件） |
| ABE 方案 | 全局共享 GPP + 动态 LSSS | 加密/解密/撤销/轮换/重加密 |

## ABE 密码学服务（5 个端点）

Java ABE 服务 (`:8081`) 使用全局共享 GPP 架构：

| 端点 | 说明 |
|------|------|
| `POST /api/encrypt?n=N` | 加密，N = 条件数量 |
| `POST /api/decrypt` | 解密（动态属性密钥生成） |
| `POST /api/revoke` | 属性撤销（SysUpd 全局公钥更新） |
| `POST /api/rekey` | 密钥轮换（SysUpd） |
| `POST /api/reencrypt` | 重加密（CTUpd） |

## 项目结构

```
program/
├── frontend/              # Vue 3 SPA 前端
│   ├── index.html         # App 壳
│   ├── css/app.css        # 森林绿设计系统
│   ├── public/images/     # 30 张福建农产品图片
│   └── js/
│       ├── api.js / app.js / vue-app.js
│       ├── components/    # 12 个基础组件
│       └── pages/vue/     # 28 个页面组件
├── backend/               # Go 后端 (:8080)
│   ├── main.go
│   └── internal/
│       ├── handler/       # HTTP 处理器
│       ├── service/       # ABE 加解密服务
│       ├── repository/    # MySQL + Fabric 数据访问
│       ├── model/         # 数据模型
│       ├── middleware/    # CORS + 缓存控制
│       └── router/        # ~45 条路由
├── chaincode/             # Fabric 追溯链码
├── crypto_service/        # Java ABE 密码学服务 (:8081)
├── scripts/               # 运维脚本
├── deploy/                # 部署配置
└── docs/                  # 项目文档 + Obsidian
```

## 数据库

| 表 | 内容 |
|----|------|
| `users` | 21 个用户（9 商家 + 1 消费者 + 2 审核方 + 1 管理员 + 1 监管方） |
| `products` | 30 种福建农产品（含图片路径） |
| `qualifications` | 21 项资质 |
| `custom_orders` | 定制需求（ABE 加密存储） |
| `orders` | 购买订单（含 merchant_name） |
| `order_responses` | 商家报价（防重复） |
| `archive_nodes` | 产品追溯档案 |

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `DB_HOST/PORT/USER/PASSWORD/NAME` | `127.0.0.1/3306/root/123456/fruit_platform` | MySQL |
| `BACKEND_PORT` | `8080` | 后端端口 |
| `ABE_SERVICE_URL` | `http://localhost:8081/api/encrypt` | 加密 |
| `ABE_DECRYPT_URL` | `http://localhost:8081/api/decrypt` | 解密 |
| `ABE_REVOKE_URL` | `http://localhost:8081/api/revoke` | 撤销 |
| `ABE_REKEY_URL` | `http://localhost:8081/api/rekey` | 轮换 |
| `ABE_REENCRYPT_URL` | `http://localhost:8081/api/reencrypt` | 重加密 |
| `FRONTEND_ROOT` | `~/program/frontend` | 前端路径 |

## 文档

- [系统架构](docs/architecture.md)
- [角色设计](docs/role-design.md)
- [ABE 策略映射](docs/abe-mapping.md)
- [API 接口文档](docs/api-reference.md)
- [Obsidian 知识库](docs/obsidian/农禾坊-MOC.md)