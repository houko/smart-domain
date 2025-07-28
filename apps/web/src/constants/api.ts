// API相关常量

// 超时配置
export const API_TIMEOUTS = {
  DEFAULT: 20000, // 20秒
  GENERATION: 20000,
  DOMAIN_CHECK: 15000,
  AUTH: 10000,
} as const

// API限制
export const API_LIMITS = {
  MAX_SUGGESTIONS_AUTHENTICATED: 4,
  MAX_SUGGESTIONS_GUEST: 2,
  DEFAULT_SUGGESTIONS: 2,
  MAX_FAVORITES: 100,
  API_RATE_LIMIT: 60,
  PAGINATION_DEFAULT_LIMIT: 20,
  PAGINATION_MAX_LIMIT: 100,
} as const

// 使用次数限制配置
export const RATE_LIMITS = {
  // 未登录用户限制
  GUEST: {
    DAILY_REQUESTS_PER_IP: 5,        // 每IP每天10次
    REQUESTS_PER_SESSION: 2,          // 每会话5次
    RATE_WINDOW_MS: 60 * 1000,        // 1分钟窗口
    RATE_MAX_REQUESTS: 2,             // 1分钟内最多3次
  },
  // 已登录用户限制
  AUTHENTICATED: {
    DAILY_REQUESTS_PER_USER: 10,      // 每用户每天50次
    RATE_WINDOW_MS: 60 * 1000,        // 1分钟窗口
    RATE_MAX_REQUESTS: 2,            // 1分钟内最多10次
  },
  // 清理配置
  CLEANUP: {
    RETENTION_DAYS: 7,                // 保留7天的记录
    CLEANUP_INTERVAL_HOURS: 24,       // 每24小时清理一次
  },
} as const

// HTTP状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  TIMEOUT: 504,
} as const

// API版本
export const API_VERSION = {
  V1: 'v1',
  CURRENT: 'v1',
} as const

// API端点基础路径
export const API_ENDPOINTS = {
  GENERATE: '/api/generate',
  V1_GENERATE: '/api/v1/generate',
  V1_FAVORITES: '/api/v1/favorites',
  V1_HISTORY: '/api/v1/history',
  V1_HEALTH: '/api/v1/health',
  V1_STATS: '/api/v1/stats',
  HEALTH: '/api/health',
  DEBUG_ENV: '/api/debug-env',
  USER_SUBSCRIPTION: '/api/user/subscription',
} as const
