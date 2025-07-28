# 域名检查功能设置指南

## 为什么需要域名注册商 API？

**重要：DNS 查询不能准确判断域名是否可以购买！**

原因：

- 🚫 很多域名已被注册但没有设置 DNS 解析
- 🚫 域名可能处于赎回期或等待释放状态  
- 🚫 某些域名被注册商保留但没有 DNS 记录

因此，本系统**必须使用域名注册商 API** 来准确检查域名可用性。

## 快速开始

### 1. 获取 GoDaddy API 凭据

#### 测试环境 (OTE)

1. 访问 <https://developer.godaddy.com>
2. 注册开发者账户
3. 创建 OTE 环境的 API Key

#### 生产环境

1. 需要单独申请生产环境凭据
2. 可能需要付费账户

### 2. 配置环境变量

在 `apps/web/.env.local` 中添加：

```env
# GoDaddy API 配置
GODADDY_API_KEY=your_api_key_here
GODADDY_API_SECRET=your_api_secret_here

# 使用 OTE 测试环境（可选）
GODADDY_API_URL=https://api.ote-godaddy.com
```

### 3. 验证配置

配置完成后，系统将：

- ✅ 准确查询域名是否可用
- ✅ 显示域名价格（OTE 环境使用预设价格）
- ✅ 提供注册商购买链接

## 常见问题

### Q: 没有配置 API 会怎样？

A: 系统会返回明确的错误消息，提示需要配置域名注册商 API。

### Q: OTE 环境价格为什么是 0？

A: OTE 是测试环境，不提供真实价格。系统会自动使用预设价格。

### Q: 可以使用其他注册商的 API 吗？

A: 目前支持 GoDaddy。未来可以扩展支持 Namecheap、Cloudflare 等。

## 支持的域名注册商

### 当前支持

- ✅ GoDaddy (OTE & Production)

### 计划支持

- ⏳ Namecheap
- ⏳ Cloudflare Registrar
- ⏳ Google Domains

## 故障排除

### 认证失败

- 检查 API Key 和 Secret 是否正确
- 确认使用的是正确的环境（OTE vs Production）
- OTE 和生产环境的凭据是分开的

### API 调用限制

- GoDaddy API 有调用频率限制
- 建议实现缓存机制减少重复查询

## 更多信息

详细的 API 使用说明请参考 [GODADDY_API_GUIDE.md](./GODADDY_API_GUIDE.md)
