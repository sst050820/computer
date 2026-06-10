# 隐农链 — 智慧农业隐私追溯平台

基于**属性基加密（ABE）**和**区块链**的果农隐私追溯平台。

## 快速开始

```bash
# 一键启动所有服务
bash scripts/start_all.sh

# 浏览器访问
# http://localhost:8080

# 停止所有服务
bash scripts/stop_all.sh
```

## 五类用户

| 角色 | 用户名 | 密码 | 功能 |
|------|--------|------|------|
| 消费者 | `zhangguonong` | `123456` | 浏览商品、发布定制需求 |
| 商家 | `fujianmingpin` | `123456` | 商品管理、需求市场接单 |
| 商家 | `shandongfengshou` | `123456` | 山东工厂 |
| 商家 | `zhejianglongjing` | `123456` | 浙江茶园 |
| 审核方 | `fujiangongshang` | `123456` | 审核颁发资质 |
| 审核方 | `youjirenzheng` | `123456` | 有机认证审核 |
| 管理员 | `admin` | `admin123` | 全局管理 |
| 监管方 | `shiyaojian` | `123456` | 追溯审查 |

完整账号列表见 [ACCOUNTS.md](../ACCOUNTS.md)。

## 项目结构

```
program/
├── frontend/           # 前端 SPA
│   ├── index.html
│   ├── css/            # 样式文件
│   └── js/
│       ├── utils.js / api.js / app.js
│       ├── components/ # 共享 UI 组件
│       └── pages/      # 页面渲染器
├── backend/            # Go 后端 (:8080)
│   ├── main.go
│   └── internal/
│       ├── handler/    # HTTP 处理器
│       ├── service/    # 业务逻辑 + ABE
│       ├── repository/ # 数据访问层
│       ├── model/      # 数据模型
│       ├── middleware/ # 中间件
│       └── router/     # 路由注册
├── chaincode/          # Fabric 链码
├── crypto_service/     # Java ABE 服务 (:8081)
├── scripts/            # 部署运维脚本
├── deploy/             # 部署配置
├── docs/               # 项目文档
└── logs/               # 运行日志
```

## 核心功能

### 私人定制 + ABE 定向可见

1. 消费者发布定制需求，设定匹配条件（产地、能力、品质等）
2. 条件自动转为 ABE 策略 → Java 加密需求内容
3. 只有资质匹配的商家才能查看完整需求详情
4. 商家资质由审核方认证颁发，不可伪造

### 产品追溯

- 种植 → 加工 → 质检 → 运输 → 到店全链路档案
- 公开节点所有人可见，加密节点仅授权方可见
- 监管方可查看全部档案

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | 原生 HTML/CSS/JS，SPA |
| 后端 | Go 1.25 + Gin |
| 密码学 | Java 17 + JPBC，MAFASAC-AR |
| 区块链 | Hyperledger Fabric 2.3 |
| ABE 方案 | 复合阶群，LSSS 访问结构 |

## 环境要求

- Linux (Ubuntu 20.04+)
- Go 1.25+
- Java JDK 17+
- Docker + Docker Compose
- Hyperledger Fabric Samples

## 文档

- [系统架构](docs/architecture.md)
- [角色设计](docs/role-design.md)
- [ABE 策略映射](docs/abe-mapping.md)
- [API 接口文档](docs/api-reference.md)
- [预置账号](docs/ACCOUNTS.md)
