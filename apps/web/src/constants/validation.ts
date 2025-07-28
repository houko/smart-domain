// 验证规则相关常量

// 表单验证
export const FORM_VALIDATION = {
  DESCRIPTION_MIN_LENGTH: 5,
  DESCRIPTION_MAX_LENGTH: 500,
  API_KEY_MIN_LENGTH: 20,
} as const

// 安全评级阈值 (CVSS)
export const SECURITY_THRESHOLDS = {
  CRITICAL: 9.0,
  HIGH: 7.0,
  MEDIUM: 4.0,
  LOW: 0.1,
} as const

// 安全等级映射
export const SECURITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFORMATIONAL: 'info',
} as const

// 安全等级标签 (中文)
export const SECURITY_LABELS = {
  CRITICAL: '严重',
  HIGH: '高危',
  MEDIUM: '中等',
  LOW: '低危',
  INFORMATIONAL: '信息',
} as const

// 字符集常量
export const CHARACTER_SETS = {
  ALPHANUMERIC:
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  HEX_PADDING: '0',
  HEX_BASE: 16,
  HEX_MIN_LENGTH: 2,
} as const

// 数组和集合验证
export const ARRAY_VALIDATION = {
  MIN_REQUIRED_LENGTH: 0,
  EMPTY_ARRAY_LENGTH: 0,
} as const
