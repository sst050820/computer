# 农禾坊 — 智慧农业隐私追溯平台

基于**属性基加密（ABE）**和**区块链**的果农隐私追溯平台。

## 快速开始

```bash
# 1. 启动 MySQL（Docker）
docker start mysql-fruit 2>/dev/null || docker run -d --name mysql-fruit \
  -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=fruit_platform \
  -p 3306:3306 mysql:8.0 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

# 2. 启动后端
cd ~/program/backend
go build -o server . && nohup ./server > /tmp/server.log 2>&1 &

# 3. 浏览器访问
# http://localhost:8080
```

## 账号

| 角色 | 用户名 | 密码 | 说明 |
|------|--------|------|------|
| 消费者 | `zhangguonong` | `123456` | 浏览商品、发布定制需求 |
| 商家 | `fujianmingpin` | `123456` | 福建名品茶厂 |
| 商家 | `shandongfengshou` | `123456` | 山东丰收食品厂 |
| 商家 | `zhejianglongjing` | `123456` | 浙江龙井茶园 |
| 商家 | `caoyuanmuye` | `123456` | 草原牧业 |
| 审核方 | `fujiangongshang` | `123456` | 福建省工商认证中心 |
| 审核方 | `youjirenzheng` | `123456` | 有机食品认证协会 |
| 管理员 | `admin` | `admin123` | 全局管理 |
| 监管方 | `shiyaojian` | `123456` | 食品药品监管局 |

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | Vue 3 CDN + 原生 HTML/CSS/JS SPA（森林绿现代简约风） |
| 后端 | Go 1.25+ + Gin |
| 数据库 | MySQL 8.0（Docker） |
| 密码学 | Java 17 + JPBC，MAFASAC-AR |
| 区块链 | Hyperledger Fabric 2.3 |
| ABE 方案 | 复合阶群，LSSS 访问结构 |

## 项目结构

```
program/
├── frontend/              # Vue 3 前端 SPA
│   ├── index.html         # App 壳
│   ├── css/app.css        # 森林绿设计系统
│   └── js/
│       ├── api.js         # API 客户端
│       ├── app.js         # 状态管理 + 购物车
│       ├── vue-app.js     # Vue 3 应用入口
│       ├── utils.js       # 工具函数
│       ├── components/    # 14 个 Vue 基础组件
│       └── pages/vue/     # 27 个 Vue 页面组件
├── backend/               # Go 后端 (:8080)
│   ├── main.go
│   └── internal/
│       ├── handler/       # 11 个 HTTP 处理器
│       ├── service/       # ABE 加解密服务
│       ├── repository/    # MySQL 数据访问层
│       ├── model/         # 数据模型
│       ├── middleware/    # 中间件
│       └── router/        # 路由注册（30+ API）
├── chaincode/             # Fabric 链码
├── crypto_service/        # Java ABE 服务 (:8081)
├── scripts/               # 运维脚本
├── deploy/                # 部署配置
├── docs/                  # 项目文档
└── logs/                  # 运行日志
```

## 数据持久化

所有数据存储在 MySQL 8.0（Docker 容器 `mysql-fruit`）：

| 表 | 内容 |
|----|------|
| `users` | 9 个用户 |
| `products` | 28 种商品 |
| `qualifications` | 7 项资质 |
| `custom_orders` | 定制需求 |
| `orders` | 购买订单 |
| `order_responses` | 订单响应 |
| `archive_nodes` | 产品追溯档案 |

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `DB_HOST` | `127.0.0.1` | MySQL 主机 |
| `DB_PORT` | `3306` | MySQL 端口 |
| `DB_USER` | `root` | MySQL 用户 |
| `DB_PASSWORD` | `123456` | MySQL 密码 |
| `DB_NAME` | `fruit_platform` | 数据库名 |
| `BACKEND_PORT` | `8080` | 后端端口 |

## 文档

- [系统架构](docs/architecture.md)
- [角色设计](docs/role-design.md)
- [ABE 策略映射](docs/abe-mapping.md)
- [API 接口文档](docs/api-reference.md)
