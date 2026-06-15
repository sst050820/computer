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

| 角色 | 用户名 | 密码 | 姓名 | 说明 |
|------|--------|------|------|------|
| 🛒 消费者 | `shike` | `123456` | 陈食客 | 浏览商品、发布定制需求、下单 |
| 🏭 商家 | `fujianmingpin` | `123456` | 福建名品茶厂 | 4项资质，最全面 |
| 🏭 商家 | `shandongfengshou` | `123456` | 山东丰收食品厂 | 2项资质 |
| 🏭 商家 | `zhejianglongjing` | `123456` | 浙江龙井茶园 | 2项资质 |
| 🏭 商家 | `caoyuanmuye` | `123456` | 草原牧业 | 无资质 |
| 🏛️ 审核方 | `fujiangongshang` | `123456` | 福建省工商认证中心 | 管辖 Location、Grade |
| 🏛️ 审核方 | `youjirenzheng` | `123456` | 有机食品认证协会 | 管辖 Quality、Organic |
| ⚙️ 管理员 | `admin` | `admin123` | 平台管理员 | 全局管理 |
| 🔍 监管方 | `shiyaojian` | `123456` | 食品药品监管局 | 追溯审查、应急解密 |

## 技术栈

| 层 | 技术 | 说明 |
|----|------|------|
| 前端 | Vue 3 CDN + 原生 HTML/CSS/JS | 无构建工具 SPA，28 个页面组件 |
| 后端 | Go 1.25+ + Gin | ~45 条 API 路由 |
| 数据库 | MySQL 8.0（Docker） | 9 用户 + 28 商品 + 7 资质 |
| 密码学 | Java 17 + JPBC | MAFASAC-AR，复合阶双线性群 |
| 区块链 | Hyperledger Fabric 2.3 | 追溯链码（可选组件） |
| ABE 方案 | 复合阶群 + LSSS 访问结构 | 支持属性撤销 + 密钥轮换 + 重加密 |

## ABE 密码学服务（5 个端点）

Java ABE 服务 (`:8081`) 使用全局共享 GPP 架构，所有会话共用同一份系统参数，确保撤销/轮换全局生效：

| 端点 | 说明 |
|------|------|
| `POST /api/encrypt?n=N` | ABE 加密，N = 条件数量（LSSS 矩阵维度） |
| `POST /api/decrypt` | ABE 解密，传入密文 + 属性，动态密钥生成 |
| `POST /api/revoke` | 属性撤销，`SysUpd()` 更新全局公钥参数 |
| `POST /api/rekey` | 系统密钥轮换，所有旧通行证失效 |
| `POST /api/reencrypt` | 密文重加密，`CTUpd()` 适配新密钥 |

## 项目结构

```
program/
├── frontend/              # Vue 3 SPA 前端
│   ├── index.html         # App 壳
│   ├── css/app.css        # 森林绿设计系统
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
│   ├── CryptoServer.java  # HTTP 服务主类
│   └── java/MAFASACAR/    # MAFASAC-AR 算法实现
├── scripts/               # 运维脚本
├── deploy/                # 部署配置
├── docs/                  # 项目文档 + Obsidian
└── logs/                  # 运行日志
```

## 数据库

| 表 | 内容 |
|----|------|
| `users` | 9 个用户（含 contact/address） |
| `products` | 28 种商品（支持编辑） |
| `qualifications` | 7 项资质 |
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
