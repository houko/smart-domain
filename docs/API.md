# Smart Domain Generator API Documentation

A comprehensive RESTful API for intelligent domain name generation and availability checking.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Endpoints](#endpoints)
- [Request/Response Format](#requestresponse-format)
- [Error Handling](#error-handling)
- [Rate Limits](#rate-limits)
- [SDKs and Examples](#sdks-and-examples)
- [Best Practices](#best-practices)
- [Support](#support)

## Overview

The Smart Domain Generator API allows you to:

- Generate intelligent domain name suggestions using AI
- Check domain availability in real-time
- Get pricing information for domains
- Access your search history and favorites
- Manage API keys and usage statistics

## Authentication

All API requests require authentication using API keys. You can generate API keys from your account dashboard.

### Getting an API Key

1. Log in to [Smart Domain Generator](https://smart-domain.com)
2. Navigate to Settings → API Keys
3. Click "Create API Key"
4. Enter a name and description for your key
5. Copy the generated key (it will only be shown once)

### Using API Keys

Include your API key in the `Authorization` header of all requests:

```bash
Authorization: Bearer your-api-key-here
```

### API Key Format

API keys follow the format: `sd_[timestamp]_[random32chars]`

Example: `sd_123456789_AbCdEfGhIjKlMnOpQrStUvWxYz123456`

## Base URL

```
https://smart-domain.com/api/v1
```

## Endpoints

### Generate Domain Suggestions

Generate AI-powered domain name suggestions based on a project description.

**Endpoint**: `POST /generate`

**Headers**:
```bash
Authorization: Bearer your-api-key-here
Content-Type: application/json
```

**Request Body**:
```json
{
  "description": "Smart home control system for IoT devices",
  "options": {
    "maxSuggestions": 5,
    "includePricing": true,
    "targetMarket": "global",
    "preferredTlds": [".com", ".io", ".app"]
  }
}
```

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `description` | string | Yes | Project description (5-500 characters) |
| `options.maxSuggestions` | number | No | Number of suggestions (1-20, default: 5) |
| `options.includePricing` | boolean | No | Include pricing information (default: true) |
| `options.targetMarket` | string | No | Target market: `global`, `china`, `us`, `eu` (default: global) |
| `options.preferredTlds` | string[] | No | Preferred top-level domains |

**Response**:
```json
{
  "success": true,
  "data": {
    "query": "Smart home control system for IoT devices",
    "analysis": {
      "keywords": ["smart", "home", "control", "system", "iot"],
      "semanticExtensions": ["automation", "device", "connected", "intelligent"]
    },
    "suggestions": [
      {
        "name": "smarthomecontrol",
        "reasoning": "Direct combination of key terms",
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
    "generatedAt": "2025-01-20T10:30:00Z"
  }
}
```

### Get Favorites

Retrieve your saved domain favorites.

**Endpoint**: `GET /favorites`

**Headers**:
```bash
Authorization: Bearer your-api-key-here
```

**Response**:
```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "id": "fav_123",
        "domain": "smartcontrol.io",
        "note": "Perfect for our IoT project",
        "createdAt": "2025-01-20T10:30:00Z"
      }
    ]
  }
}
```

### Add to Favorites

Save a domain to your favorites list.

**Endpoint**: `POST /favorites`

**Request Body**:
```json
{
  "domain": "smartcontrol.io",
  "note": "Perfect for our IoT project"
}
```

### Get Search History

Retrieve your search history.

**Endpoint**: `GET /history`

**Query Parameters**:
- `limit`: Number of results (default: 20, max: 100)
- `offset`: Pagination offset (default: 0)

### Get Usage Statistics

Get your API usage statistics.

**Endpoint**: `GET /stats`

**Response**:
```json
{
  "success": true,
  "data": {
    "currentPeriod": {
      "requests": 145,
      "limit": 1000,
      "resetDate": "2025-02-01T00:00:00Z"
    },
    "thisMonth": {
      "totalRequests": 545,
      "successfulRequests": 532,
      "errorRequests": 13
    }
  }
}
```

## Request/Response Format

### Content Types

- **Request**: `application/json`
- **Response**: `application/json; charset=utf-8`

### Standard Response Structure

All API responses follow this structure:

```json
{
  "success": boolean,
  "data": object | null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": object | null
  } | null
}
```

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid or missing API key |
| 403 | Forbidden - Insufficient permissions |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 504 | Gateway Timeout - Request processing timeout |

### Error Codes

| Error Code | Description |
|------------|-------------|
| `INVALID_API_KEY` | API key is invalid or malformed |
| `API_KEY_NOT_FOUND` | API key does not exist |
| `RATE_LIMIT_EXCEEDED` | Monthly API limit exceeded |
| `VALIDATION_ERROR` | Request validation failed |
| `TIMEOUT_ERROR` | Request processing timed out |
| `INTERNAL_ERROR` | Internal server error |
| `INSUFFICIENT_CREDITS` | Not enough API credits |

### Error Response Example

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Monthly API limit exceeded. Current usage: 1001/1000",
    "details": {
      "currentUsage": 1001,
      "limit": 1000,
      "resetDate": "2025-02-01T00:00:00Z"
    }
  }
}
```

## Rate Limits

Rate limits are applied per API key:

| Plan | Monthly Requests | Rate Limit |
|------|------------------|------------|
| Free | 0 | No API access |
| Pro | 1,000 | 100/hour |
| Enterprise | Unlimited | 1,000/hour |

### Rate Limit Headers

Response headers provide rate limit information:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1643723400
```

## SDKs and Examples

### JavaScript/Node.js

```javascript
const SMART_DOMAIN_API_KEY = 'sd_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const API_BASE_URL = 'https://smart-domain.com/api/v1';

class SmartDomainAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = API_BASE_URL;
  }

  async generateSuggestions(description, options = {}) {
    const response = await fetch(`${this.baseURL}/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description,
        options: {
          maxSuggestions: 5,
          includePricing: true,
          targetMarket: 'global',
          ...options
        }
      })
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  }

  async getFavorites() {
    const response = await fetch(`${this.baseURL}/favorites`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    const result = await response.json();
    return result.success ? result.data : null;
  }

  async addToFavorites(domain, note = '') {
    const response = await fetch(`${this.baseURL}/favorites`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ domain, note })
    });

    const result = await response.json();
    return result.success;
  }
}

// Usage example
const api = new SmartDomainAPI(SMART_DOMAIN_API_KEY);

async function example() {
  try {
    const suggestions = await api.generateSuggestions(
      'AI-powered fitness tracking app',
      { maxSuggestions: 3, preferredTlds: ['.com', '.app'] }
    );
    
    console.log('Domain suggestions:', suggestions);
    
    // Add first available domain to favorites
    const firstSuggestion = suggestions.suggestions[0];
    const availableDomain = firstSuggestion.domains.find(d => d.available);
    
    if (availableDomain) {
      await api.addToFavorites(availableDomain.domain, 'AI fitness app project');
      console.log('Added to favorites:', availableDomain.domain);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

example();
```

### Python

```python
import requests
import json

class SmartDomainAPI:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'https://smart-domain.com/api/v1'
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }

    def generate_suggestions(self, description, options=None):
        if options is None:
            options = {}
        
        payload = {
            'description': description,
            'options': {
                'maxSuggestions': 5,
                'includePricing': True,
                'targetMarket': 'global',
                **options
            }
        }
        
        response = requests.post(
            f'{self.base_url}/generate',
            headers=self.headers,
            json=payload
        )
        
        result = response.json()
        
        if not result.get('success'):
            raise Exception(result['error']['message'])
        
        return result['data']

    def get_favorites(self):
        response = requests.get(
            f'{self.base_url}/favorites',
            headers={'Authorization': f'Bearer {self.api_key}'}
        )
        
        result = response.json()
        return result['data'] if result.get('success') else None

    def add_to_favorites(self, domain, note=''):
        payload = {'domain': domain, 'note': note}
        
        response = requests.post(
            f'{self.base_url}/favorites',
            headers=self.headers,
            json=payload
        )
        
        result = response.json()
        return result.get('success', False)

# Usage example
api = SmartDomainAPI('sd_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')

try:
    suggestions = api.generate_suggestions(
        'AI-powered fitness tracking app',
        {'maxSuggestions': 3, 'preferredTlds': ['.com', '.app']}
    )
    
    print('Domain suggestions:')
    for suggestion in suggestions['suggestions']:
        print(f"- {suggestion['name']}")
        for domain in suggestion['domains']:
            status = 'Available' if domain['available'] else 'Taken'
            print(f"  {domain['domain']} - {status}")
            
except Exception as e:
    print(f'Error: {e}')
```

### cURL

```bash
# Generate domain suggestions
curl -X POST https://smart-domain.com/api/v1/generate \
  -H "Authorization: Bearer sd_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "AI-powered fitness tracking app",
    "options": {
      "maxSuggestions": 3,
      "includePricing": true,
      "targetMarket": "global",
      "preferredTlds": [".com", ".app"]
    }
  }'

# Get favorites
curl -X GET https://smart-domain.com/api/v1/favorites \
  -H "Authorization: Bearer sd_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Add to favorites
curl -X POST https://smart-domain.com/api/v1/favorites \
  -H "Authorization: Bearer sd_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "smartfitness.app",
    "note": "Perfect for our AI fitness project"
  }'

# Get usage statistics
curl -X GET https://smart-domain.com/api/v1/stats \
  -H "Authorization: Bearer sd_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## Best Practices

### Security

1. **Protect Your API Keys**: Never expose API keys in client-side code
2. **Use Environment Variables**: Store API keys securely in environment variables
3. **Rotate Keys Regularly**: Generate new API keys periodically
4. **Monitor Usage**: Keep track of your API usage to detect anomalies

### Performance

1. **Cache Results**: Cache domain suggestions for identical queries
2. **Batch Requests**: Use appropriate `maxSuggestions` values
3. **Handle Rate Limits**: Implement exponential backoff for rate-limited requests
4. **Set Timeouts**: Configure appropriate request timeouts

### Error Handling

1. **Retry Logic**: Implement retry logic for transient errors
2. **Graceful Degradation**: Handle API failures gracefully
3. **Log Errors**: Log API errors for debugging and monitoring
4. **Validate Responses**: Always check the `success` field in responses

### Example Error Handling

```javascript
async function makeAPIRequest(url, options) {
  const maxRetries = 3;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      
      if (response.status === 429) {
        // Rate limited, wait and retry
        const retryAfter = response.headers.get('Retry-After') || 60;
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        retries++;
        continue;
      }
      
      if (!result.success) {
        throw new Error(result.error.message);
      }
      
      return result.data;
    } catch (error) {
      if (retries === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff
      const delay = Math.pow(2, retries) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
    }
  }
}
```

## API Key Management

### Creating API Keys

- Maximum 10 API keys per account
- Keys never expire (optional expiration can be set)
- Each key has a unique name and description
- Keys are only shown once upon creation

### Security Features

- API keys are hashed using SHA-256
- Only key prefixes are stored for display
- Row Level Security (RLS) ensures user isolation
- Usage tracking for monitoring and analytics

### Key Limits

| Plan | Max Keys | Requests/Hour | Monthly Limit |
|------|----------|---------------|---------------|
| Free | 0 | N/A | No API access |
| Pro | 10 | 100 | 1,000 |
| Enterprise | 50 | 1,000 | Unlimited |

## Support

### Documentation

- [Getting Started Guide](https://smart-domain.com/docs)
- [API Status Page](https://status.smart-domain.com)
- [Changelog](https://smart-domain.com/changelog)

### Contact

- **Email**: support@smart-domain.com
- **GitHub Issues**: [Smart Domain Repository](https://github.com/houko/smart-domain/issues)
- **Discord Community**: [Join our Discord](https://discord.gg/smart-domain)

### Response Times

- **General Inquiries**: 1-2 business days
- **Technical Issues**: 4-8 hours
- **Critical Issues**: 1-2 hours

---

**API Version**: v1  
**Last Updated**: January 2025  
**Status**: Production Ready