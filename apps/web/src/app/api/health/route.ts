import { SERVICE_CONFIG, VERSION_INFO } from '@/constants'
import { NextResponse } from 'next/server'

export async function GET() {
  // 简单的健康检查，不需要数据库连接
  return NextResponse.json({
    status: SERVICE_CONFIG.STATUS_HEALTHY,
    timestamp: new Date().toISOString(),
    service: 'smart-domain-web',
    version: VERSION_INFO.API_VERSION,
  })
}
