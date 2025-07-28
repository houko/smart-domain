// 错误处理和消息常量

// 默认错误消息
export const ERROR_MESSAGES = {
  DEFAULT: '操作失败，请稍后重试',
  API_ERROR: 'API请求失败',
  NETWORK_ERROR: '网络连接失败',
  VALIDATION_ERROR: '输入验证失败',
  AUTHENTICATION_ERROR: '身份验证失败',
  AUTHORIZATION_ERROR: '权限不足',
  NOT_FOUND: '资源未找到',
  SERVER_ERROR: '服务器内部错误',
  TIMEOUT_ERROR: '请求超时',
  VALIDATION_FAILED: '请求参数验证失败',
  TIMEOUT_SUGGESTIONS: '请求处理超时，请尝试减少生成数量或稍后重试',
  GENERATION_ERROR: '生成域名建议时发生错误',
  UNAUTHORIZED: 'Invalid API key',
  RATE_LIMIT_EXCEEDED: 'Monthly API limit exceeded',
} as const

// 成功消息
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: '保存成功',
  DELETE_SUCCESS: '删除成功',
  UPDATE_SUCCESS: '更新成功',
  CREATE_SUCCESS: '创建成功',
  OPERATION_SUCCESS: '操作成功',
} as const

// 验证消息
export const VALIDATION_MESSAGES = {
  MIN_LENGTH: '输入长度不足',
  MAX_LENGTH: '输入长度超限',
  REQUIRED: '此字段为必填项',
  INVALID_FORMAT: '格式不正确',
  INVALID_EMAIL: '邮箱格式不正确',
  INVALID_URL: '网址格式不正确',
} as const

// API 状态消息
export const API_STATUS_MESSAGES = {
  LOADING: '加载中...',
  NO_DATA: '暂无数据',
  EMPTY_RESULT: '未找到相关结果',
  PARTIAL_SUCCESS: '部分操作成功',
} as const

// 特定功能错误
export const FEATURE_ERRORS = {
  DOMAIN_GENERATION_FAILED: '域名生成失败',
  FAVORITE_ADD_FAILED: '添加收藏失败',
  FAVORITE_REMOVE_FAILED: '移除收藏失败',
  HISTORY_LOAD_FAILED: '历史记录加载失败',
  SEARCH_FAILED: '搜索失败',
  EXPORT_FAILED: '导出失败',
  IMPORT_FAILED: '导入失败',
} as const

// 错误代码
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  STATS_FETCH_ERROR: 'STATS_FETCH_ERROR',
} as const

// 超时相关建议
export const TIMEOUT_SUGGESTIONS = [
  '减少 maxSuggestions 参数',
  '减少 preferredTlds 数量',
  '简化描述文本',
] as const

// 用户相关错误消息
export const USER_ERROR_MESSAGES = {
  UNAUTHORIZED: '未授权',
  PROFILE_FETCH_FAILED: '获取用户信息失败',
  API_KEYS_FETCH_FAILED: '获取API密钥失败',
  SERVER_ERROR: '服务器错误',
  SUBSCRIPTION_FETCH_FAILED: '获取订阅信息失败',
  STATS_FETCH_FAILED: '获取统计数据失败',
} as const
