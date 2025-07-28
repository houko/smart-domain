import { RATE_LIMITS } from '@/constants'
import { createClient } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

// 使用次数限制结果类型
export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: Date
  error?: string
}

// 获取客户端IP地址
export function getClientIP(request: NextRequest): string {
  // 优先从代理头获取真实IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  // 从连接信息获取IP（在本地开发时可能是127.0.0.1）
  const connectionIP = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1'
  return connectionIP
}

// 获取会话ID（从cookie或生成新的）
export function getSessionId(request: NextRequest): string {
  const sessionCookie = request.cookies.get('session_id')
  if (sessionCookie?.value) {
    return sessionCookie.value
  }
  
  // 如果没有会话ID，生成一个基于IP和User-Agent的唯一标识
  const ip = getClientIP(request)
  const userAgent = request.headers.get('user-agent') || ''
  return `${ip}-${Buffer.from(userAgent).toString('base64').slice(0, 10)}`
}

// 检查IP级别的限制
export async function checkIPRateLimit(
  ip: string,
  endpoint: string,
  isAuthenticated: boolean = false
): Promise<RateLimitResult> {
  try {
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const limits = isAuthenticated ? RATE_LIMITS.AUTHENTICATED : RATE_LIMITS.GUEST
    
    // 检查每日限制（针对未登录用户）
    if (!isAuthenticated) {
      const { data: dailyCount } = await serviceSupabase.rpc(
        'get_ip_request_count',
        {
          p_ip_address: ip,
          p_endpoint: endpoint,
          p_time_window_minutes: 24 * 60, // 24小时
        }
      )
      
      const dailyLimit = RATE_LIMITS.GUEST.DAILY_REQUESTS_PER_IP
      if ((dailyCount || 0) >= dailyLimit) {
        return {
          success: false,
          limit: dailyLimit,
          remaining: 0,
          resetTime: getNextMidnight(),
          error: '已达到每日请求限制，请明天再试',
        }
      }
    }

    // 检查短期限制（1分钟内）
    const { data: recentCount } = await serviceSupabase.rpc(
      'get_ip_request_count',
      {
        p_ip_address: ip,
        p_endpoint: endpoint,
        p_time_window_minutes: limits.RATE_WINDOW_MS / (1000 * 60), // 转换为分钟
      }
    )

    const rateLimit = limits.RATE_MAX_REQUESTS
    const remaining = Math.max(0, rateLimit - (recentCount || 0))
    
    if ((recentCount || 0) >= rateLimit) {
      return {
        success: false,
        limit: rateLimit,
        remaining: 0,
        resetTime: new Date(Date.now() + limits.RATE_WINDOW_MS),
        error: '请求过于频繁，请稍后再试',
      }
    }

    return {
      success: true,
      limit: rateLimit,
      remaining,
      resetTime: new Date(Date.now() + limits.RATE_WINDOW_MS),
    }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    // 在出错时允许请求通过，但记录错误
    return {
      success: true,
      limit: 0,
      remaining: 0,
      resetTime: new Date(),
      error: '限制检查失败',
    }
  }
}

// 检查会话级别的限制（针对未登录用户）
export async function checkSessionRateLimit(
  sessionId: string,
  endpoint: string
): Promise<RateLimitResult> {
  try {
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: sessionCount } = await serviceSupabase.rpc(
      'get_session_request_count',
      {
        p_session_id: sessionId,
        p_endpoint: endpoint,
        p_time_window_minutes: 24 * 60, // 24小时
      }
    )

    const sessionLimit = RATE_LIMITS.GUEST.REQUESTS_PER_SESSION
    const remaining = Math.max(0, sessionLimit - (sessionCount || 0))
    
    if ((sessionCount || 0) >= sessionLimit) {
      return {
        success: false,
        limit: sessionLimit,
        remaining: 0,
        resetTime: getNextMidnight(),
        error: '已达到会话请求限制',
      }
    }

    return {
      success: true,
      limit: sessionLimit,
      remaining,
      resetTime: getNextMidnight(),
    }
  } catch (error) {
    console.error('Session rate limit check failed:', error)
    return {
      success: true,
      limit: 0,
      remaining: 0,
      resetTime: new Date(),
      error: '会话限制检查失败',
    }
  }
}

// 检查用户级别的限制（针对已登录用户）
export async function checkUserRateLimit(
  userId: string,
  endpoint: string
): Promise<RateLimitResult> {
  try {
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 检查每日限制
    const { data: dailyCount } = await serviceSupabase.rpc(
      'get_user_request_count',
      {
        p_user_id: userId,
        p_endpoint: endpoint,
        p_time_window_minutes: 24 * 60, // 24小时
      }
    )
    
    const dailyLimit = RATE_LIMITS.AUTHENTICATED.DAILY_REQUESTS_PER_USER
    if ((dailyCount || 0) >= dailyLimit) {
      return {
        success: false,
        limit: dailyLimit,
        remaining: 0,
        resetTime: getNextMidnight(),
        error: '已达到每日请求限制',
      }
    }

    // 检查短期限制
    const { data: recentCount } = await serviceSupabase.rpc(
      'get_user_request_count',
      {
        p_user_id: userId,
        p_endpoint: endpoint,
        p_time_window_minutes: RATE_LIMITS.AUTHENTICATED.RATE_WINDOW_MS / (1000 * 60),
      }
    )

    const rateLimit = RATE_LIMITS.AUTHENTICATED.RATE_MAX_REQUESTS
    const remaining = Math.max(0, rateLimit - (recentCount || 0))
    
    if ((recentCount || 0) >= rateLimit) {
      return {
        success: false,
        limit: rateLimit,
        remaining: 0,
        resetTime: new Date(Date.now() + RATE_LIMITS.AUTHENTICATED.RATE_WINDOW_MS),
        error: '请求过于频繁，请稍后再试',
      }
    }

    return {
      success: true,
      limit: dailyLimit,
      remaining: Math.max(0, dailyLimit - (dailyCount || 0)),
      resetTime: getNextMidnight(),
    }
  } catch (error) {
    console.error('User rate limit check failed:', error)
    return {
      success: true,
      limit: 0,
      remaining: 0,
      resetTime: new Date(),
      error: '用户限制检查失败',
    }
  }
}

// 记录API请求
export async function recordAPIRequest(
  ip: string,
  endpoint: string,
  userId?: string,
  sessionId?: string,
  userAgent?: string
): Promise<void> {
  try {
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await serviceSupabase.from('rate_limiting').insert({
      ip_address: ip,
      endpoint,
      user_id: userId || null,
      session_id: sessionId || null,
      user_agent: userAgent || null,
    })
  } catch (error) {
    console.error('Failed to record API request:', error)
    // 记录失败不应该影响API请求本身
  }
}

// 综合限制检查函数
export async function checkRateLimit(
  request: NextRequest,
  endpoint: string,
  userId?: string
): Promise<RateLimitResult> {
  const ip = getClientIP(request)
  const sessionId = getSessionId(request)
  const isAuthenticated = !!userId

  // 先检查IP限制
  const ipCheck = await checkIPRateLimit(ip, endpoint, isAuthenticated)
  if (!ipCheck.success) {
    return ipCheck
  }

  if (isAuthenticated && userId) {
    // 已登录用户：检查用户限制
    const userCheck = await checkUserRateLimit(userId, endpoint)
    if (!userCheck.success) {
      return userCheck
    }
  } else {
    // 未登录用户：检查会话限制
    const sessionCheck = await checkSessionRateLimit(sessionId, endpoint)
    if (!sessionCheck.success) {
      return sessionCheck
    }
  }

  // 所有检查通过，记录这次请求
  await recordAPIRequest(
    ip,
    endpoint,
    userId,
    sessionId,
    request.headers.get('user-agent') || undefined
  )

  return {
    success: true,
    limit: isAuthenticated 
      ? RATE_LIMITS.AUTHENTICATED.DAILY_REQUESTS_PER_USER 
      : RATE_LIMITS.GUEST.DAILY_REQUESTS_PER_IP,
    remaining: ipCheck.remaining,
    resetTime: ipCheck.resetTime,
  }
}

// 辅助函数：获取下一个午夜时间
function getNextMidnight(): Date {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  return tomorrow
}