// UI和用户体验相关常量

// Toast 通知配置
export const TOAST_CONFIG = {
  LIMIT: 1,
  REMOVE_DELAY: 1000000,
  INITIAL_OPEN_STATE: true,
} as const

// Toast 动作类型
export const TOAST_ACTIONS = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const

// SEO 相关配置
export const SEO_CONFIG = {
  // 图片尺寸
  OG_IMAGE_WIDTH: 1200,
  OG_IMAGE_HEIGHT: 630,

  // 文本限制
  DESCRIPTION_MAX_LENGTH: 160,
  DESCRIPTION_TRUNCATE_SUFFIX: '...',
  DESCRIPTION_TRUNCATE_OFFSET: 3,
  WORD_BREAK_THRESHOLD: 0.8,

  // 社交媒体
  TWITTER_CARD_TYPE: 'summary_large_image',
  TWITTER_CREATOR: '@smartdomain',

  // 视口和主题
  INITIAL_SCALE: 1,
  THEME_COLOR: '#3b82f6',
  VIEWPORT_WIDTH: 'device-width',

  // Schema.org 评分
  BEST_RATING: 5,
  WORST_RATING: 1,

  // 文件路径
  MANIFEST_PATH: '/manifest.json',
  FAVICON_ICO: '/favicon.ico',
  FAVICON_SVG: '/favicon.svg',
  FAVICON_SIZES: '16x16 32x32 48x48 64x64',
  FAVICON_TYPE: 'image/x-icon',
  FAVICON_SVG_TYPE: 'image/svg+xml',
} as const

// 网站信息
export const SITE_INFO = {
  NAME: 'Smart Domain Generator',
  DEFAULT_DESCRIPTION: '智能域名生成器 - AI驱动的项目命名和域名建议系统',
  DEFAULT_URL: 'https://smart-domain.com',
  AUTHORS: ['Smart Domain Team'],
} as const

// SEO 关键词
export const SEO_KEYWORDS = [
  '智能域名生成器',
  'AI域名生成',
  '项目命名',
  '域名查询',
  '域名建议',
  '批量域名查询',
  'API接口',
  '域名可用性检查',
] as const

// 页面类型
export const PAGE_TYPES = {
  WEBSITE: 'website',
  ARTICLE: 'article',
  PRODUCT: 'product',
  PROFILE: 'profile',
} as const

// 机器人指令
export const ROBOTS_CONFIG = {
  INDEX_FOLLOW: 'index, follow',
  NOINDEX_NOFOLLOW: 'noindex, nofollow',
} as const
