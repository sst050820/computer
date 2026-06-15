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

- N = 条件数量 = LSSS 矩阵维度
- 所有条件必须同时满足（AND 逻辑）
- 加密时将 N 传递到 Java 服务：`POST /api/encrypt?n=N`

## 策略示例

| 业务需求 | ABE 策略 | LSSS 矩阵 |
|---------|---------|-----------|
| 只要福建厂商 | `(Location=福建; 1)` | 1×1 |
| 福建 + 制茶 | `(Location=福建, Capability=制茶; 2)` | 2×2 |
| 福建 + 制茶 + 有机 + 3级 | `(Location=福建, Capability=制茶, Quality=有机, Grade=3; 4)` | 4×4 |

## ABE 密码学架构

Java ABE 服务采用**全局共享 GPP** 架构：

```
启动时:  globalP4.GlobalSetup() + AuthSetup(5)
          → 全局 GPP + 5 个 AttributeAuthority

加密请求: session.GPP = globalP4.GPP  // 共享
          session.AA  = globalP4.AA   // 共享
          session.KeyGen(GPP, 0, n)   // n = 条件数
          session.Enc(GPP, n, n)      // n×n LSSS 矩阵
          → 密文 + sessionID 返回

解密请求: session.KeyGen(GPP, 0, attrCount)  // 商家实际属性数
          session.Dec(GPP) → validDec()

撤销操作: globalP4.SysUpd()  // 更新全局 GPP.RP
          → 所有会话的旧密钥立刻失效 ✅
```

## 完整 ABE 流程

```
消费者发布需求
  → 选择条件(产地=福建, 制茶能力)
  → ConditionToPolicy → "(Location=福建, Capability=制茶; 2)"
  → EncryptWithABE(描述, 2) → Java POST /api/encrypt?n=2
  → LSSS 2×2 矩阵加密，生成用户密钥
  → {id, status:"encrypted"} + sessionID 存入 MySQL

商家查看需求
  → 点击「ABE 解密验证」
  → POST /api/custom-orders/:id/decrypt + 商家资质 {Location:福建, Capability:制茶}
  → Java POST /api/decrypt → 解析属性数=2 → KeyGen(GPP,0,2) → Dec(GPP)
  → ✅ 解密成功 → 返回原文（密码学验证通过）
  → ❌ 解密失败 → MatchAttributes 降级字符串匹配

审核方收回资质
  → POST /api/qualifications/:id/revoke
  → DB: status='revoked'
  → Java POST /api/revoke → globalP4.SysUpd() → GPP.RP 全局更新
  → 所有持有该属性密钥的会话解密能力失效

管理员密钥轮换
  → POST /api/admin/sys-update
  → Java POST /api/rekey → globalP4.SysUpd() → 新系统参数
  → DB: ExpireAllQualifications() → 所有 active 资质 → expired
  → 所有商家需重新申请资质 + 旧密文需 CTUpd 重加密
```

## 降级策略

| 场景 | 策略 |
|------|------|
| Java ABE 服务不可用 | `EncryptWithABE` 返回明文 |
| Java ABE 解密失败 | `MatchAttributes` 属性字符串匹配 |
| Java ABE 撤销失败 | DB 标记 + 提示"系统密钥更新后生效" |
| ABE 解密拒绝 (403) | 显示资质不满足条件，引导申请资质 |

## MAFASAC-AR 参数

| 参数 | 说明 |
|------|------|
| 群 | 复合阶双线性群 (Type A1, 256-bit) |
| LSSS 矩阵 | Vandermonde 矩阵，维度 = 条件数 |
| 授权方数量 | 5（每个全局属性一个） |
| 属性撤销 | SysUpd（全局公钥更新，所有旧密钥失效） |
| 密钥轮换 | 同 SysUpd + ExpireAllQualifications |
| 重加密 | CTUpd（旧密文适配新 GPP 参数） |

## Java ABE 5 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/encrypt?n=N` | POST | 加密，N = 条件数 |
| `/api/decrypt` | POST | 解密，body: {ciphertext, attributes} |
| `/api/revoke` | POST | 属性撤销，调用 globalP4.SysUpd() |
| `/api/rekey` | POST | 密钥轮换，调用 globalP4.SysUpd() |
| `/api/reencrypt` | POST | 重加密，调用 session.CTUpd() |
