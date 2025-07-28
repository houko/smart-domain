// 客户端配置
export const statsigClientOptions = {
  sdkKey: process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY || 'demo-key',
  // 启用调试模式（开发环境）
  enableDebugLogging: process.env.NODE_ENV === 'development',
  // 网络配置
  api: 'https://statsigapi.net/v1',
  // 本地存储配置
  localStorage: {
    prefix: 'smart-domain-',
  },
}

// 简化版服务端函数
export const initializeStatsigServer = async () => {
  return true
}

export const getStatsigServer = () => null

// 功能标志名称常量
export const FEATURE_FLAGS = {
  // 搜索相关
  ENABLE_ADVANCED_SEARCH: 'enable_advanced_search',
  ENABLE_AI_SUGGESTIONS: 'enable_ai_suggestions',
  ENABLE_SECURITY_CHECK: 'enable_security_check',

  // 用户界面
  SHOW_PRICING_INFO: 'show_pricing_info',
  SHOW_ANALYTICS_DASHBOARD: 'show_analytics_dashboard',
  ENABLE_DARK_MODE: 'enable_dark_mode',

  // 功能特性
  ENABLE_BATCH_OPERATIONS: 'enable_batch_operations',
  ENABLE_PREMIUM_FEATURES: 'enable_premium_features',
  ENABLE_EXPORT_FEATURES: 'enable_export_features',

  // 实验性功能
  ENABLE_BETA_FEATURES: 'enable_beta_features',
  ENABLE_NEW_UI: 'enable_new_ui',
} as const

// 配置参数名称常量
export const CONFIG_PARAMS = {
  MAX_SEARCH_RESULTS: 'max_search_results',
  SEARCH_TIMEOUT_MS: 'search_timeout_ms',
  MAX_FAVORITES: 'max_favorites',
  API_RATE_LIMIT: 'api_rate_limit',
  CACHE_TTL_SECONDS: 'cache_ttl_seconds',
} as const

// 实验名称常量
export const EXPERIMENTS = {
  SEARCH_ALGORITHM: 'search_algorithm_experiment',
  UI_LAYOUT: 'ui_layout_experiment',
  PRICING_DISPLAY: 'pricing_display_experiment',
} as const

// 用户类型
export interface StatsigUser {
  userID?: string
  email?: string
  ip?: string
  userAgent?: string
  country?: string
  locale?: string
  customIDs?: Record<string, string>
  custom?: Record<string, unknown>
}

// 创建默认用户对象
export const createStatsigUser = (
  userOverrides: Partial<StatsigUser> = {},
): StatsigUser => {
  return {
    userID: userOverrides.userID || 'anonymous',
    locale: userOverrides.locale || 'zh-CN',
    country: userOverrides.country || 'CN',
    ...userOverrides,
  }
}
