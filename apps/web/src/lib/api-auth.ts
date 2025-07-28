import { hashApiKey } from '@/lib/api-key-server'
import { createClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'

export interface ApiKeyValidationResult {
  valid: boolean
  userId?: string
  keyId?: string
  error?: string
}

// 验证API密钥
export async function validateApiKey(
  apiKey: string,
): Promise<ApiKeyValidationResult> {
  try {
    if (!apiKey) {
      return { valid: false, error: 'API key is required' }
    }

    // 验证密钥格式
    if (!/^sd_[a-z0-9]+_[A-Za-z0-9]{32}$/.test(apiKey)) {
      return { valid: false, error: 'Invalid API key format' }
    }

    const supabase = await createClient()
    const keyHash = hashApiKey(apiKey)

    // 查询数据库验证密钥
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, user_id, expires_at')
      .eq('key_hash', keyHash)
      .single()

    if (error || !data) {
      return { valid: false, error: 'Invalid API key' }
    }

    // 检查是否过期
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { valid: false, error: 'API key has expired' }
    }

    // 更新最后使用时间
    await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id)

    return {
      valid: true,
      userId: data.user_id,
      keyId: data.id,
    }
  } catch (_error) {
    return { valid: false, error: 'Internal server error' }
  }
}

// 从请求中提取API密钥
export function extractApiKey(request: NextRequest): string | null {
  // 从 Authorization header 中提取
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // 从查询参数中提取（不推荐，仅用于测试）
  const apiKey = request.nextUrl.searchParams.get('api_key')
  if (apiKey) {
    return apiKey
  }

  return null
}

// API路由中间件
export async function requireApiKey(
  request: NextRequest,
): Promise<ApiKeyValidationResult> {
  const apiKey = extractApiKey(request)

  if (!apiKey) {
    return { valid: false, error: 'API key is required' }
  }

  return await validateApiKey(apiKey)
}

// 记录API使用情况
export async function logApiUsage(
  keyId: string,
  endpoint: string,
  method: string,
  statusCode: number,
  request: NextRequest,
) {
  try {
    const supabase = await createClient()

    await supabase.from('api_key_usage').insert({
      api_key_id: keyId,
      endpoint,
      method,
      status_code: statusCode,
      ip_address:
        request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
    })
  } catch (error) {
    console.error('Failed to log API usage:', error)
  }
}
