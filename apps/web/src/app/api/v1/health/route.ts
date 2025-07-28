import {
  ARRAY_VALIDATION,
  HTTP_STATUS,
  SERVICE_CONFIG,
  VERSION_INFO,
} from '@/constants'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // 检查数据库连接
    const supabase = await createClient()

    // 尝试执行一个简单的查询来验证数据库连接
    const { error } = await supabase
      .from('profiles')
      .select('count')
      .limit(ARRAY_VALIDATION.EMPTY_ARRAY_LENGTH + 1)
      .single()

    if (error) {
      // 如果是没有数据的错误，这是正常的
      if (error.code !== 'PGRST116') {
        throw error
      }
    }

    // 返回健康状态
    return NextResponse.json({
      status: SERVICE_CONFIG.STATUS_HEALTHY,
      timestamp: new Date().toISOString(),
      service: SERVICE_CONFIG.NAME,
      version: VERSION_INFO.API_VERSION,
      database: SERVICE_CONFIG.DATABASE_STATUS_CONNECTED,
    })
  } catch (error) {
    // 返回不健康状态
    return NextResponse.json(
      {
        status: SERVICE_CONFIG.STATUS_UNHEALTHY,
        timestamp: new Date().toISOString(),
        service: SERVICE_CONFIG.NAME,
        version: VERSION_INFO.API_VERSION,
        database: SERVICE_CONFIG.DATABASE_STATUS_DISCONNECTED,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: HTTP_STATUS.SERVICE_UNAVAILABLE },
    )
  }
}

// OPTIONS 请求处理（用于 CORS）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: HTTP_STATUS.OK,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
