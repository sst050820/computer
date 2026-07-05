# 农禾坊

基于属性基加密（ABE）的特色农产品交易与隐私定制需求平台。

本项目面向福建特色农产品交易场景，重点展示“支持属性撤销的多授权方完全适应性安全访问控制方案”在业务系统中的落地：消费者可以发布加密定制需求，只有持有匹配资质的商家才能解密查看完整需求内容。

## 1. 项目定位

农禾坊不是单纯的电商页面，而是一个把 ABE 密码服务、资质授权、定制需求撮合、订单交易和追溯监管串起来的完整演示系统。

核心目标：

- 保护消费者定制需求中的描述、联系方式、地址等敏感信息。
- 用商家资质决定其是否具备解密资格。
- 支持资质撤销、属性撤销和全局密钥轮换。
- 提供消费者、商家、审核方、管理员、监管方五类角色的完整测试流程。

## 2. 系统架构

| 层级 | 技术 | 说明 |
| --- | --- | --- |
| 前端 | Vue 3 CDN + HTML/CSS/JS | 单页应用，按角色展示不同菜单和页面 |
| 后端 | Go 1.25 + Gin | 业务 API、静态前端托管、ABE 服务调度 |
| 数据库 | MySQL 8.0 | 用户、商品、订单、资质、定制需求等数据 |
| 密码服务 | Java 17 + JPBC | MAFASAC-AR ABE 加密、解密、撤销、重加密 |
| 区块链追溯 | Hyperledger Fabric（可选） | 产品追溯数据上链，服务不可用时不影响主流程 |

默认端口：

| 服务 | 端口 | 说明 |
| --- | --- | --- |
| Go 后端 + 前端 | `8080` | 浏览器访问入口 |
| Java ABE 密码服务 | `8081` | 只提供 API，不提供网页 |
| MySQL | `3306` | 业务数据库 |

## 3. 核心功能

### 3.1 消费者

- 浏览福建特色农产品，查看真实商品图片。
- 加入购物车、结算、查看订单进度。
- 发布私人定制需求，并选择访问条件。
- 查看商家报价，接受报价后生成订单。

### 3.2 商家

- 发布和管理商品。
- 在需求市场查看定制需求。
- 使用资质进行 ABE 解密验证。
- 解密成功后查看需求详情并报价。
- 管理订单状态：确认接单、发货、送达、完成、取消。

### 3.3 审核方

- 审核商家资质申请。
- 颁发、拒绝、收回、续期、恢复资质。
- 收回资质时触发 ABE 属性撤销接口。

### 3.4 管理员

- 管理用户、资质、定制需求和纠纷。
- 规则管理中提供三种更新策略：
  - 普通规则更新：只更新规则版本，现有资质保持有效。
  - 指定属性撤销：撤销指定属性值，例如 `Location=泉州`。
  - 全局密钥轮换：调用 ABE Rekey，所有有效资质变为过期。

### 3.5 监管方

- 查询产品追溯档案。
- 查看商家合规状态。
- 执行应急解密和商品抽检。

## 4. ABE 密码服务

Java 密码服务运行在 `8081`，只作为后端调用的 API 服务使用，因此直接打开 `http://localhost:8081` 没有网页显示是正常的。

主要端点：

| 端点 | 功能 |
| --- | --- |
| `POST /api/encrypt?n=N` | 按 N 个条件生成 LSSS 矩阵并加密 |
| `POST /api/decrypt` | 根据商家属性进行解密验证 |
| `POST /api/revoke` | 属性撤销，更新全局公开参数 |
| `POST /api/rekey` | 全局密钥轮换 |
| `POST /api/reencrypt` | 密文更新 |

业务层调用关系：

1. 消费者发布定制需求。
2. 后端把条件转换为策略表达式，例如 `(Location=泉州, Quality=有机; 2)`。
3. 后端调用 Java ABE `/api/encrypt?n=2`。
4. 密文、策略、会话 ID 存入 MySQL。
5. 商家解密时，后端取出商家的 active 资质并调用 `/api/decrypt`。
6. 解密成功返回需求详情，失败则拒绝访问。

## 5. 撤销与更新机制

当前系统把“规则更新”和“密码学撤销”区分为三种策略，避免普通更新导致所有资质失效。

| 策略 | 前端入口 | 后端行为 | 影响范围 |
| --- | --- | --- | --- |
| 普通规则更新 | 管理员规则管理 | 只更新规则版本 | 不影响已有资质 |
| 指定属性撤销 | 管理员规则管理 | 调用 `/api/revoke`，并将匹配属性资质置为 `revoked` | 仅影响指定属性 |
| 全局密钥轮换 | 管理员规则管理 | 调用 `/api/rekey`，并将所有 active 资质置为 `expired` | 影响所有有效资质 |

审核方在“资质管理”中收回某条资质时，也会调用属性撤销逻辑，使该资质进入 `revoked` 状态。

## 6. 快速启动

推荐在 Ubuntu 虚拟机中运行。

### 6.1 启动全部服务

```bash
cd ~/program
bash scripts/start_all.sh
```

启动后访问：

```text
http://localhost:8080
```

### 6.2 分步启动

```bash
# 启动 MySQL 和后端
bash scripts/start_backend.sh

# 启动 Java ABE 密码服务
bash scripts/start_crypto.sh

# 停止服务
bash scripts/stop_all.sh
```

### 6.3 手动启动参考

```bash
# MySQL
docker start mysql-fruit || docker run -d --name mysql-fruit \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e MYSQL_DATABASE=fruit_platform \
  -p 3306:3306 mysql:8.0 \
  --character-set-server=utf8mb4 \
  --collation-server=utf8mb4_unicode_ci

# Java ABE
cd crypto_service
java -cp "lib/*:classes" CryptoServer

# Go 后端
cd backend
go build -o server .
FRONTEND_ROOT="../frontend" ./server
```

## 7. 测试账号

普通账号密码均为 `123456`，管理员密码为 `admin123`。

| 角色 | 用户名 | 说明 |
| --- | --- | --- |
| 消费者 | `shike` | 浏览商品、发布定制需求、下单 |
| 商家 | `sanming` | 三明农产品 |
| 商家 | `nanping` | 南平农产品 |
| 商家 | `ningde` | 宁德农产品 |
| 商家 | `fuzhou` | 福州农产品 |
| 商家 | `longyan` | 龙岩农产品 |
| 商家 | `putian` | 莆田农产品 |
| 商家 | `quanzhou` | 泉州农产品 |
| 商家 | `zhangzhou` | 漳州农产品 |
| 商家 | `xiamen` | 厦门农产品 |
| 审核方 | `fujiangongshang` | 管辖 Location、Grade |
| 审核方 | `youjirenzheng` | 管辖 Quality、Capability、Organic |
| 管理员 | `admin` | 平台管理，密码 `admin123` |
| 监管方 | `shiyaojian` | 追溯审查、应急解密 |

## 8. 推荐测试流程

### 8.1 ABE 定制需求流程

1. 使用 `shike` 登录。
2. 进入“私人定制”，填写需求并选择访问条件。
3. 使用匹配资质的商家登录，例如对应地区商家。
4. 进入“需求市场”，点击 ABE 解密验证。
5. 解密成功后提交报价。
6. 回到消费者账号，在“我的需求”中接受报价并生成订单。

### 8.2 属性撤销流程

1. 使用审核方或管理员登录。
2. 收回某个商家的资质，或在管理员规则管理中选择“指定属性撤销”。
3. 被撤销属性对应的资质变为 `revoked`。
4. 商家再次进入需求市场时，不再具备对应需求的解密资格。

### 8.3 全局密钥轮换流程

1. 使用管理员登录。
2. 进入“规则管理”。
3. 点击“全局密钥轮换”。
4. 所有 active 资质变为 `expired`，商家需要重新申请或由审核方恢复/续期。

## 9. API 摘要

### 认证

- `POST /api/auth/login`
- `POST /api/auth/register`
- `PUT /api/user/profile`

### 商品

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/my-products`

### 定制需求

- `POST /api/custom-order`
- `GET /api/custom-orders`
- `GET /api/custom-orders/:id`
- `POST /api/custom-orders/:id/respond`
- `POST /api/custom-orders/:id/decrypt`
- `PUT /api/custom-orders/:id/status`
- `DELETE /api/custom-orders/:id`
- `GET /api/public-orders`
- `GET /api/demand-market`

### 订单

- `POST /api/orders`
- `GET /api/consumer/orders`
- `GET /api/merchant/orders`
- `PUT /api/orders/:id/status`
- `DELETE /api/orders/:id`
- `GET /api/admin/purchase-orders`

### 资质与审核

- `GET /api/my-qualifications`
- `POST /api/qualifications/apply`
- `GET /api/review-list`
- `POST /api/review/:id/approve`
- `POST /api/review/:id/reject`
- `POST /api/qualifications/:id/revoke`
- `PUT /api/qualifications/:id/renew`
- `PUT /api/qualifications/:id/restore`

### 管理与监管

- `GET /api/admin/users`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/qualifications`
- `GET /api/admin/orders`
- `GET /api/admin/disputes`
- `POST /api/admin/sys-update`
- `GET /api/archive/:productId`
- `GET /api/regulator/search`
- `POST /api/regulator/emergency`

## 10. 项目特点

- ABE 密码服务与业务后端分离，便于单独测试和替换。
- 定制需求支持按属性策略加密发布。
- 支持资质审核、撤销、续期、恢复。
- 支持普通规则更新、指定属性撤销、全局密钥轮换三种策略。
- 商品、购物车、订单页面均支持真实图片展示。
- 前端可完整演示五类角色的业务闭环。
