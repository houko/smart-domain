# Smart Domain API 使用指南

## 获取 API 密钥

1. 登录到 Smart Domain 网站
2. 进入 设置 → API密钥
3. 点击"创建API密钥"
4. 输入密钥名称和描述
5. 复制生成的密钥（注意：密钥只会显示一次）

## API 端点

基础 URL: `https://smart-domain.com/api/v1`

### 生成域名建议

**端点**: `POST /generate`

**请求头**:

```bash
Authorization: Bearer your-api-key-here
Content-Type: application/json
```

**请求体**:

```json
{
  "description": "智能家居控制系统",
  "options": {
    "maxSuggestions": 5,
    "includePricing": true,
    "targetMarket": "global",
    "preferredTlds": [".com", ".io", ".app"]
  }
}
```

**参数说明**:

- `description` (必需): 项目描述，5-500字符
- `options` (可选):
  - `maxSuggestions`: 生成建议数量，1-20，默认5
  - `includePricing`: 是否包含价格信息，默认true
  - `targetMarket`: 目标市场，可选值：global, china, us, eu，默认global
  - `preferredTlds`: 偏好的顶级域名列表

**响应示例**:

```json
{
  "success": true,
  "data": {
    "query": "智能家居控制系统",
    "analysis": {
      "keywords": ["智能", "家居", "控制", "系统"],
      "semanticExtensions": ["smart", "home", "control", "system", "iot", "automation"]
    },
    "suggestions": [
      {
        "name": "smarthomecontrol",
        "domains": [
          {
            "domain": "smarthomecontrol.com",
            "available": false,
            "price": {
              "currency": "USD",
              "amount": 12.99,
              "period": "YEAR"
            }
          },
          {
            "domain": "smarthomecontrol.io",
            "available": true,
            "price": {
              "currency": "USD",
              "amount": 35.00,
              "period": "YEAR"
            }
          }
        ]
      }
    ],
    "generatedAt": "2024-01-20T10:30:00Z"
  }
}
```

## 使用示例

### JavaScript/Node.js

```javascript
const API_KEY = 'sd_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const API_URL = 'https://smart-domain.com/api/v1/generate';

async function generateDomainSuggestions(description) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: description,
        options: {
          maxSuggestions: 5,
          includePricing: true,
          targetMarket: 'global',
          preferredTlds: ['.com', '.io', '.app']
        }
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('域名建议:', result.data.suggestions);
    } else {
      console.error('错误:', result.error);
    }
  } catch (error) {
    console.error('请求失败:', error);
  }
}

// 使用示例
generateDomainSuggestions('智能家居控制系统');
```

### Python

```python
import requests
import json

API_KEY = 'sd_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
API_URL = 'https://smart-domain.com/api/v1/generate'

def generate_domain_suggestions(description):
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'description': description,
        'options': {
            'maxSuggestions': 5,
            'includePricing': True,
            'targetMarket': 'global',
            'preferredTlds': ['.com', '.io', '.app']
        }
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        result = response.json()
        
        if result.get('success'):
            print('域名建议:', json.dumps(result['data']['suggestions'], indent=2, ensure_ascii=False))
        else:
            print('错误:', result.get('error'))
    except Exception as e:
        print('请求失败:', str(e))

# 使用示例
generate_domain_suggestions('智能家居控制系统')
```

### cURL

```bash
curl -X POST https://smart-domain.com/api/v1/generate \
  -H "Authorization: Bearer sd_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "智能家居控制系统",
    "options": {
      "maxSuggestions": 5,
      "includePricing": true,
      "targetMarket": "global",
      "preferredTlds": [".com", ".io", ".app"]
    }
  }'
```

## 错误处理

### 常见错误码

- `401 UNAUTHORIZED`: API密钥无效或未提供
- `429 RATE_LIMIT_EXCEEDED`: 超出月度API调用限制
- `400 VALIDATION_ERROR`: 请求参数验证失败
- `504 TIMEOUT_ERROR`: 请求处理超时
- `500 INTERNAL_ERROR`: 服务器内部错误

### 错误响应示例

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Monthly API limit exceeded. Current usage: 1001/1000"
  }
}
```

## API 限制

根据您的订阅计划，API调用有以下限制：

- **免费版**: 无API访问权限
- **专业版**: 每月1000次调用
- **企业版**: 无限制调用

## 最佳实践

1. **保护您的API密钥**: 不要在前端代码中暴露API密钥
2. **错误重试**: 实现指数退避的重试机制
3. **缓存结果**: 对相同的查询缓存结果以减少API调用
4. **批量处理**: 合理设置maxSuggestions参数
5. **监控使用量**: 定期检查API使用情况避免超限

## 需要帮助？

如有问题，请联系 <support@smart-domain.com>
