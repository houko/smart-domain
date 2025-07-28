// 国际化和本地化常量

// 支持的语言和地区
export const LOCALES = {
  ZH_CN: 'zh-CN',
  EN_US: 'en-US',
  JA_JP: 'ja-JP',
  ZH: 'zh',
  EN: 'en',
  JA: 'ja',
} as const

// 默认语言配置
export const DEFAULT_LOCALE = LOCALES.ZH

// 语言代码映射
export const LOCALE_MAPPING = {
  CHINESE_SIMPLIFIED: LOCALES.ZH_CN,
  ENGLISH_US: LOCALES.EN_US,
  JAPANESE: LOCALES.JA_JP,
} as const

// Schema.org 相关常量
export const SCHEMA_ORG = {
  CONTEXT: 'https://schema.org',
  BREADCRUMB_TYPE: 'BreadcrumbList',
  LIST_ITEM_TYPE: 'ListItem',
  PRODUCT_TYPE: 'Product',
  BRAND_TYPE: 'Brand',
  OFFER_TYPE: 'Offer',
  RATING_TYPE: 'AggregateRating',
  PROPERTY_VALUE_TYPE: 'PropertyValue',
  FEATURE_NAME: 'Feature',
  IN_STOCK_STATUS: 'InStock',
  DEFAULT_CURRENCY: 'CNY',
} as const

// 货币相关
export const CURRENCY = {
  DEFAULT: 'CNY',
  CNY: 'CNY',
  USD: 'USD',
} as const

// 字符编码和索引
export const TEXT_PROCESSING = {
  POSITION_BASE: 1, // Schema.org position 从 1 开始
  ARRAY_INDEX_BASE: 0, // 数组索引从 0 开始
  SUBSTRING_START: 0,
} as const
