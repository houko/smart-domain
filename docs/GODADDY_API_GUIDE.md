# GoDaddy API 使用指南

## 重要说明：为什么必须使用域名注册商 API

**DNS 查询不能准确判断域名是否可以购买**，原因如下：

- 很多域名已被注册但没有设置 DNS 解析
- 域名可能处于赎回期或等待释放状态
- 某些域名被注册商保留但没有 DNS 记录

因此，**必须使用域名注册商 API（如 GoDaddy）来准确检查域名可用性**。

## 环境说明

### OTE (测试环境)

- **URL**: `https://api.ote-godaddy.com`
- **特点**:
  - ✅ 域名可用性查询正常
  - ❌ 价格数据返回 0
  - ✅ 无需付费即可测试
  - ✅ 不会产生真实交易

### Production (生产环境)

- **URL**: `https://api.godaddy.com`
- **特点**:
  - ✅ 真实的域名可用性
  - ✅ 真实的市场价格
  - ⚠️ 需要生产环境 API 凭据
  - ⚠️ 可能需要付费账户

## 切换到生产环境

1. **获取生产环境凭据**
   - 登录 GoDaddy 开发者账户
   - 创建生产环境 API Key
   - 注意：生产环境和 OTE 环境的凭据是分开的

2. **更新 .env.local**

   ```env
   # 使用生产环境
   GODADDY_API_KEY=your_production_key
   GODADDY_API_SECRET=your_production_secret
   # 注释掉或删除这行以使用生产环境
   # GODADDY_API_URL=https://api.ote-godaddy.com
   ```

3. **价格 API 端点**
   - 单个 TLD 价格: `GET /v1/domains/tlds/{tld}`
   - 所有 TLD 价格: `GET /v1/domains/tlds`
   - 域名定价: `GET /v1/domains/agreements`

## 当前实现的智能处理

系统已经实现了智能价格回退：

1. 首先尝试从 API 获取价格
2. 如果价格为 0（OTE 环境），使用预设价格
3. 确保用户始终看到合理的价格信息

## 价格数据来源选择

### 选项 1：继续使用 OTE + 预设价格

- ✅ 免费测试
- ✅ 功能完整
- ❌ 价格不是实时的

### 选项 2：切换到生产环境

- ✅ 真实价格数据
- ✅ 实时市场价格
- ❌ 需要生产凭据
- ❌ 可能有 API 调用限制

### 选项 3：混合方案

- 域名可用性：使用 GoDaddy API
- 价格数据：集成其他价格 API 或维护价格表
