import {
  API_KEY,
  CHARACTER_SETS,
  CRYPTO_CONFIG,
  ENVIRONMENT,
} from '@/constants'

// 生成安全的随机API密钥
export function generateApiKey(): string {
  const timestamp = Date.now().toString(CRYPTO_CONFIG.TIMESTAMP_BASE)
  const randomPart = generateRandomString(API_KEY.RANDOM_PART_LENGTH)
  return `${API_KEY.PREFIX_PATTERN}${timestamp}_${randomPart}`
}

// 生成随机字符串（仅浏览器环境）
function generateRandomString(length: number): string {
  const chars = CHARACTER_SETS.ALPHANUMERIC
  let result = ''
  const array = new Uint8Array(length)

  if (ENVIRONMENT.NODE_CRYPTO_AVAILABLE) {
    window.crypto.getRandomValues(array)
  } else {
    // 在服务端环境，使用 Math.random 作为后备方案
    // 注意：这不如 crypto.getRandomValues 安全，仅用于开发环境
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * CRYPTO_CONFIG.RANDOM_BYTE_MAX)
    }
  }

  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length]
  }

  return result
}

// 异步版本，兼容浏览器和服务端
export async function hashApiKeyAsync(apiKey: string): Promise<string> {
  if (ENVIRONMENT.BROWSER_CONTEXT && window.crypto && window.crypto.subtle) {
    // 浏览器环境使用 Web Crypto API
    const encoder = new TextEncoder()
    const data = encoder.encode(apiKey)
    const hashBuffer = await window.crypto.subtle.digest(
      CRYPTO_CONFIG.HASH_ALGORITHM,
      data,
    )
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray
      .map((b) =>
        b
          .toString(CHARACTER_SETS.HEX_BASE)
          .padStart(CHARACTER_SETS.HEX_MIN_LENGTH, CHARACTER_SETS.HEX_PADDING),
      )
      .join('')
  }
  // 服务端环境返回一个占位符（实际的哈希应该在服务端API中处理）
  throw new Error('Server-side hashing should be done in API routes')
}

// 获取API密钥的前缀（用于显示）
export function getApiKeyPrefix(apiKey: string): string {
  return `${apiKey.substring(0, API_KEY.DISPLAY_PREFIX_LENGTH)}...`
}

// 验证API密钥格式
export function validateApiKey(apiKey: string): boolean {
  return API_KEY.VALIDATION_REGEX.test(apiKey)
}

// 格式化显示API密钥（只显示部分）
export function formatApiKeyForDisplay(apiKey: string): string {
  if (apiKey.length < API_KEY.MIN_LENGTH_FOR_MASKING) {
    return apiKey
  }
  return `${apiKey.substring(0, API_KEY.DISPLAY_PREFIX_LENGTH)}...${apiKey.substring(apiKey.length - API_KEY.DISPLAY_SUFFIX_LENGTH)}`
}
