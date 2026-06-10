# 农淘 — 系统架构

## 架构图

```
浏览器 (Vue 3 SPA)
    │
    ├── /index.html → Vue 3 App Shell
    ├── /css/app.css → 森林绿设计系统
    ├── /js/vue-app.js → 主应用
    ├── /js/pages/vue/ → 27 页面组件
    └── /js/components/ → 12 组件
    
    │ HTTP (Gin)
    ▼
Go 后端 (:8080)
    ├── handler/    → 11 处理器
    ├── service/    → ABE 加解密
    ├── repository/ → MySQL 访问层
    └── model/      → 数据模型
    
    │ SQL
    ▼
MySQL 8.0 (Docker)
    7 张表，种子数据自动导入
    
    (可选)
    ▼
Java ABE (:8081)    Fabric 区块链
```

## 前端

- **框架**: Vue 3 CDN（无构建工具）
- **设计**: 森林绿 `#2D6A4F` + 暖土中性色，8px 网格
- **组件**: 9 Base + 3 业务 + 27 页面 = 39 组件
- **状态**: `App` 全局对象 + Vue.reactive（购物车）
- **持久化**: localStorage（session/cart/messages）+ MySQL（业务）

## 后端

- **框架**: Go + Gin，30+ API
- **数据库**: MySQL 8.0，go-sql-driver/mysql
- **种子**: 9 用户 + 28 商品 + 7 资质，按表检测自动补缺

## 数据流

```
用户操作 → Vue 组件 → API.fetch() → Gin → Handler → Repository → MySQL
                                           ↓
                                    响应式 UI 自动刷新
```

## 部署

```bash
make start    # 一键启动（MySQL + 后端）
make stop     # 停止
make clean    # 清理
```
