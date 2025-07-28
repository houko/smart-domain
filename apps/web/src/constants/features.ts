// 功能标志和配置常量

// 加密和哈希
export const CRYPTO_CONFIG = {
  HASH_ALGORITHM: 'SHA-256',
  TIMESTAMP_BASE: 36,
  RANDOM_BYTE_MAX: 256,
  SAFE_INTEGER_MAX: Number.MAX_SAFE_INTEGER,
} as const

// 系统统计和监控
export const MONITORING = {
  DEFAULT_UPTIME: 99.9,
  SERVICE_STATUS: 'operational',
  USAGE_RESET_LIMIT: 50,
  MONTHLY_USAGE_INIT: 0,
} as const

// 默认配置值
export const DEFAULT_VALUES = {
  TARGET_MARKET: 'global',
  INCLUDE_PRICING: false,
  MAX_SEARCH_RESULTS: 6,
  SHOW_PRICING: false,
} as const

// 环境配置
export const ENVIRONMENT = {
  NODE_CRYPTO_AVAILABLE: typeof window !== 'undefined' && window.crypto,
  BROWSER_CONTEXT: typeof window !== 'undefined',
} as const

// 计数器和序列
export const COUNTERS = {
  INITIAL_COUNT: 0,
  COUNT_INCREMENT: 1,
} as const

// 服务配置
export const SERVICE_CONFIG = {
  NAME: 'smart-domain-api',
  DOMAIN_GENERATOR_SERVICE: 'domain-generator-api',
  DATABASE_STATUS_CONNECTED: 'connected',
  DATABASE_STATUS_DISCONNECTED: 'disconnected',
  STATUS_HEALTHY: 'healthy',
  STATUS_UNHEALTHY: 'unhealthy',
  STATUS_OK: 'ok',
  SERVICE_AVAILABILITY: '24/7',
} as const

// 订阅计划限制
export const SUBSCRIPTION_LIMITS = {
  FREE_API_LIMIT: 0, // 免费版没有API访问权限
  PROFESSIONAL_API_LIMIT: 1000,
  ENTERPRISE_API_LIMIT: null, // 无限制
  FREE_PLAN: 'free',
  PROFESSIONAL_PLAN: 'professional',
  ENTERPRISE_PLAN: 'enterprise',
} as const
