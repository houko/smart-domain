# API 端点说明

## 内部 API（网页使用）

### POST /api/generate
- **认证方式**: Supabase Auth（需要用户登录）
- **用途**: 供网页前端使用，不需要API密钥
- **限制**: 无调用次数限制

## 外部 API（第三方调用）

### POST /api/v1/generate
- **认证方式**: Bearer Token（API密钥）
- **用途**: 供外部应用调用
- **限制**: 
  - free: 无API访问权限
  - professional: 1000次/月
  - enterprise: 无限制

### 获取 API 密钥
1. 登录网站
2. 进入设置页面
3. 选择"API密钥"标签
4. 创建新的API密钥

### 使用示例

```javascript
// 外部API调用（需要API密钥）
const response = await fetch('https://yourdomain.com/api/v1/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    description: '智能家居控制系统',
    options: {
      maxSuggestions: 5,
      includePricing: true,
      targetMarket: 'global',
      preferredTlds: ['.com', '.io']
    }
  })
});
```