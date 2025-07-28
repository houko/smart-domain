import { logApiUsage, requireApiKey } from '@/lib/api-auth'
import { createClient } from '@/lib/supabase/server'
export const dynamic = 'force-dynamic'
import {
  API_LIMITS,
  API_TIMEOUTS,
  DOMAIN_CONSTANTS,
  ERROR_CODES,
  ERROR_MESSAGES,
  FORM_VALIDATION,
  GENERATION_OPTIONS,
  HTTP_STATUS,
  SERVICE_CONFIG,
  SUBSCRIPTION_LIMITS,
  TARGET_MARKETS,
  TIMEOUT_SUGGESTIONS,
  VERSION_INFO,
} from '@/constants'
import { analyzeText, generateProjectNames } from '@smart-domain/ai'
import { aggregateResults, checkDomainAvailability } from '@smart-domain/domain'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// 请求验证 schema
const generateRequestSchema = z.object({
  description: z
    .string()
    .min(FORM_VALIDATION.DESCRIPTION_MIN_LENGTH)
    .max(FORM_VALIDATION.DESCRIPTION_MAX_LENGTH),
  options: z
    .object({
      maxSuggestions: z
        .number()
        .min(1)
        .max(API_LIMITS.MAX_SUGGESTIONS_AUTHENTICATED)
        .default(API_LIMITS.DEFAULT_SUGGESTIONS),
      includePricing: z.boolean().default(true),
      targetMarket: z
        .enum([
          TARGET_MARKETS.GLOBAL,
          TARGET_MARKETS.CHINA,
          TARGET_MARKETS.US,
          TARGET_MARKETS.EU,
        ])
        .default(GENERATION_OPTIONS.DEFAULT_TARGET_MARKET),
      preferredTlds: z.array(z.string()).optional(),
    })
    .optional(),
})

export async function POST(request: NextRequest) {
  // API密钥认证
  const authResult = await requireApiKey(request)
  if (!authResult.valid) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: authResult.error || ERROR_MESSAGES.UNAUTHORIZED,
        },
      },
      { status: HTTP_STATUS.UNAUTHORIZED },
    )
  }

  const { userId, keyId } = authResult
  let statusCode = 200

  try {
    // 检查用户的订阅计划和API调用限制
    const supabase = await createClient()

    // 获取用户的订阅信息
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_plan')
      .eq('id', userId)
      .single()

    const subscriptionPlan = profile?.subscription_plan || 'free'

    // 获取本月API调用次数
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    const { count: monthlyUsage } = await supabase
      .from('api_key_usage')
      .select('*', { count: 'exact', head: true })
      .eq('api_key_id', keyId)
      .gte('created_at', `${currentMonth}-01`)

    // 检查API调用限制
    const limits = {
      [SUBSCRIPTION_LIMITS.FREE_PLAN]: SUBSCRIPTION_LIMITS.FREE_API_LIMIT, // 免费版没有API访问权限
      [SUBSCRIPTION_LIMITS.PROFESSIONAL_PLAN]:
        SUBSCRIPTION_LIMITS.PROFESSIONAL_API_LIMIT,
      [SUBSCRIPTION_LIMITS.ENTERPRISE_PLAN]:
        SUBSCRIPTION_LIMITS.ENTERPRISE_API_LIMIT, // 无限制
    }

    const limit = limits[subscriptionPlan as keyof typeof limits]
    if (limit !== null && (monthlyUsage || 0) >= limit) {
      statusCode = HTTP_STATUS.TOO_MANY_REQUESTS
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
            message: `${ERROR_MESSAGES.RATE_LIMIT_EXCEEDED}. Current usage: ${monthlyUsage}/${limit}`,
          },
        },
        { status: HTTP_STATUS.TOO_MANY_REQUESTS },
      )
    }

    // 设置超时控制 - Vercel 函数默认 25 秒，我们设置 20 秒以便有时间返回错误
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error('Request timeout')),
        API_TIMEOUTS.GENERATION,
      )
    })

    const processPromise = async () => {
      // 1. 验证请求
      const body = await request.json()
      const { description, options } = generateRequestSchema.parse(body)

      // 2. NLP 分析
      const analysisResult = await analyzeText(description)

      // 3. 生成项目名
      const projectNames = await generateProjectNames(
        analysisResult.keywords,
        analysisResult.semanticExtensions,
        {
          maxCount: options?.maxSuggestions || API_LIMITS.DEFAULT_SUGGESTIONS,
          targetMarket:
            options?.targetMarket || GENERATION_OPTIONS.DEFAULT_TARGET_MARKET,
        },
      )

      // 4. 批量检查域名可用性
      const domainResults = await Promise.all(
        projectNames.map(async (projectName) => {
          // 减少默认检查的 TLD 数量
          const tlds = options?.preferredTlds || [
            ...DOMAIN_CONSTANTS.DEFAULT_TLDS,
          ]
          const domains = await checkDomainAvailability(
            projectName.name,
            tlds,
            {
              includePricing: options?.includePricing !== false,
              godaddyApiKey: process.env.GODADDY_API_KEY,
              godaddyApiSecret: process.env.GODADDY_API_SECRET,
              useGoDaddyAPI: !!(
                process.env.GODADDY_API_KEY && process.env.GODADDY_API_SECRET
              ),
            },
          )
          return {
            ...projectName,
            domains,
          }
        }),
      )

      // 5. 聚合和格式化结果
      const finalResults = aggregateResults(domainResults)

      const response = {
        success: true,
        data: {
          query: description,
          analysis: {
            keywords: analysisResult.keywords,
            semanticExtensions: analysisResult.semanticExtensions,
          },
          suggestions: finalResults,
          generatedAt: new Date().toISOString(),
        },
      }

      // 记录API使用情况
      if (keyId) {
        await logApiUsage(
          keyId,
          '/api/v1/generate',
          'POST',
          statusCode,
          request,
        )
      }

      return NextResponse.json(response)
    }

    // 使用 Promise.race 来实现超时控制
    return (await Promise.race([processPromise(), timeoutPromise])) as Response
  } catch (error) {
    console.error('Generate API Error:', error)
    console.error(
      'Error stack:',
      error instanceof Error ? error.stack : 'No stack trace',
    )

    if (error instanceof z.ZodError) {
      statusCode = HTTP_STATUS.BAD_REQUEST
      const response = NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: ERROR_MESSAGES.VALIDATION_FAILED,
            details: error.errors,
          },
        },
        { status: HTTP_STATUS.BAD_REQUEST },
      )

      // 记录失败的API调用
      if (keyId) {
        await logApiUsage(
          keyId,
          '/api/v1/generate',
          'POST',
          statusCode,
          request,
        )
      }

      return response
    }

    // 处理超时错误
    if (error instanceof Error && error.message === 'Request timeout') {
      statusCode = HTTP_STATUS.TIMEOUT
      const response = NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.TIMEOUT_ERROR,
            message: ERROR_MESSAGES.TIMEOUT_SUGGESTIONS,
            suggestions: TIMEOUT_SUGGESTIONS,
          },
        },
        { status: HTTP_STATUS.TIMEOUT },
      )

      if (keyId) {
        await logApiUsage(
          keyId,
          '/api/v1/generate',
          'POST',
          statusCode,
          request,
        )
      }

      return response
    }

    // 在开发环境下返回更详细的错误信息
    const isDev = process.env.NODE_ENV === 'development'

    statusCode = HTTP_STATUS.INTERNAL_ERROR
    const response = NextResponse.json(
      {
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: ERROR_MESSAGES.GENERATION_ERROR,
          ...(isDev && {
            details: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          }),
        },
      },
      { status: HTTP_STATUS.INTERNAL_ERROR },
    )

    if (keyId) {
      await logApiUsage(keyId, '/api/v1/generate', 'POST', statusCode, request)
    }

    return response
  }
}

// 健康检查
export async function GET() {
  return Response.json({
    status: 'ok',
    service: SERVICE_CONFIG.DOMAIN_GENERATOR_SERVICE,
    version: VERSION_INFO.API_VERSION,
    timestamp: new Date().toISOString(),
  })
}
