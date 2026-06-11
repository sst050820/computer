# ABE 策略 → 业务映射

## 条件类型

| 业务条件 | 字段名 | ABE 策略片段 | 前端选项 |
|---------|--------|-------------|---------|
| 产地要求 | Location | `Location=福建` | 福建/山东/浙江/云南/安徽/四川/广东 |
| 加工能力 | Capability | `Capability=制茶` | 制茶/果蔬加工/糕点制作/酿造/干货加工/冷冻加工 |
| 品质认证 | Quality | `Quality=有机` | 有机/绿色/地理标志/无公害 |
| 等级要求 | Grade | `Grade=3` | 1/2/3/4/5 |
| 有机认证 | Organic | `Organic=是` | 是/否 |

## 策略表达式格式

```
(属性1=值1, 属性2=值2; N)
```

- N = 条件数量（LSSS 访问矩阵阈值）
- 所有条件必须同时满足（AND 逻辑）

## 策略示例

| 业务需求 | ABE 策略 |
|---------|---------|
| 只要福建工厂 | `(Location=福建; 1)` |
| 福建 + 制茶能力 | `(Location=福建, Capability=制茶; 2)` |
| 福建 + 制茶 + 有机 + 3级 | `(Location=福建, Capability=制茶, Quality=有机, Grade=3; 4)` |

## 完整 ABE 流程

```
消费者发布需求
  → 选择条件(产地=福建, 制茶能力)
  → ConditionToPolicy → "(Location=福建, Capability=制茶; 2)"
  → EncryptWithABE(描述) → Java ABE 服务 POST /api/encrypt
  → 密文 + sessionID 存入 MySQL custom_orders

商家查看需求
  → 点击「ABE 解密验证」
  → POST /api/custom-orders/:id/decrypt + 商家资质
  → DecryptWithABE(密文, 资质) → Java ABE 服务 POST /api/decrypt
  → ✅ 成功：返回解密原文
  → ❌ 失败：MatchAttributes 降级匹配

审核方收回资质
  → POST /api/qualifications/:id/revoke
  → DB: status='revoked'
  → ABE: RevokeAttribute(type, value) → Java POST /api/revoke
  → 持有该属性的用户私钥失效

管理员更新规则
  → POST /api/admin/sys-update
  → ABE: UpdateSystemKeys() → Java POST /api/rekey
  → DB: ExpireAllQualifications() → 所有旧资质过期
```

## 降级策略

| 条件 | 策略 |
|------|------|
| Java ABE 服务不可用 | `EncryptWithABE` 返回明文 |
| Java ABE 解密失败 | `MatchAttributes` 属性字符串匹配 |
| Java ABE 撤销失败 | DB 标记 + 提示"系统密钥更新后生效" |

## MAFASAC-AR 参数

| 参数 | 说明 |
|------|------|
| 群 | 复合阶双线性群 (Type A1, 256-bit) |
| LSSS 矩阵 | Vandermonde 矩阵 |
| 授权方数量 | 等于全局属性数量 |
| 属性撤销 | 支持 (SysUpd/KeyUpd/CTUpd) |
| 访问结构 | (l, k) — l 行 k 列矩阵 |
