// 业务逻辑相关常量

// 域名和项目相关
export const DOMAIN_CONSTANTS = {
  // 注意：描述长度在validation.ts中定义
  // 注意：建议数量和收藏限制在api.ts中定义
  DEFAULT_TLDS: ['.com', '.io', '.app'],
  MIN_DOMAIN_LENGTH: 3,
  MAX_DOMAIN_LENGTH: 63,
} as const

// 分页相关
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  FAVORITES_BATCH_LIMIT: 1000,
  HISTORY_LIMIT: 50,
  SUBSCRIPTION_HISTORY_LIMIT: 1000,
} as const

// API Key 相关
export const API_KEY = {
  RANDOM_PART_LENGTH: 32,
  DISPLAY_PREFIX_LENGTH: 12,
  DISPLAY_SUFFIX_LENGTH: 4,
  MIN_LENGTH_FOR_MASKING: 20,
  PREFIX_PATTERN: 'sd_',
  VALIDATION_REGEX: /^sd_[a-z0-9]+_[A-Za-z0-9]{32}$/,
} as const

// 生成选项
export const GENERATION_OPTIONS = {
  DEFAULT_TARGET_MARKET: 'global',
  TEST_MAX_SUGGESTIONS: 3,
} as const

// 目标市场常量
export const TARGET_MARKETS = {
  GLOBAL: 'global',
  CHINA: 'china',
  US: 'us',
  EU: 'eu',
} as const

// 版本信息
export const VERSION_INFO = {
  API_VERSION: '1.0.0',
} as const

// 系统统计
export const SYSTEM_STATS = {
  DEFAULT_UPTIME: 99.9,
  AVAILABILITY_STATUS: 'operational',
} as const

// 订阅计划限制详情
export const SUBSCRIPTION_PLAN_LIMITS = {
  FREE: {
    NAME: '免费版',
    LIMIT: 50,
    API_LIMIT: 0,
    PRICE: '¥0',
    FEATURES: ['每月 50 次域名查询', '基础 AI 建议', '搜索历史（7天）'],
  },
  PRO: {
    NAME: '专业版',
    LIMIT: 1000,
    API_LIMIT: 1000,
    PRICE: '¥99',
    FEATURES: [
      '每月 1000 次域名查询',
      '高级 AI 建议',
      '无限搜索历史',
      '批量查询（最多50个）',
      '高级 AI 分析',
      'API 访问（1000次/月）',
      '邮件支持',
    ],
  },
  ENTERPRISE: {
    NAME: '企业版',
    LIMIT: -1,
    API_LIMIT: -1,
    PRICE: '¥399',
    FEATURES: [
      '无限域名查询',
      '企业级 AI 建议',
      '无限搜索历史',
      '批量查询（无限制）',
      '高级 AI 分析',
      'API 访问（无限制）',
      '24/7 优先支持',
    ],
  },
} as const
