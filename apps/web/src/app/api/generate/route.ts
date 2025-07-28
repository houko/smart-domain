import {
  API_LIMITS,
  API_TIMEOUTS,
  DOMAIN_CONSTANTS,
  ERROR_CODES,
  ERROR_MESSAGES,
  FORM_VALIDATION,
  GENERATION_OPTIONS,
  HTTP_STATUS,
  TARGET_MARKETS,
  TIMEOUT_SUGGESTIONS,
} from '@/constants'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limiting'
import { analyzeText, generateProjectNames } from '@smart-domain/ai'
import { aggregateResults, checkDomainAvailability } from '@smart-domain/domain'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// 内部API，供前端使用，不需要API密钥认证

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
  try {
    // 检查用户是否登录（可选，用于限制功能）
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    // 用户状态：已登录用户可以使用完整功能，未登录用户有基本限制
    const isAuthenticated = !authError && !!user

    // 检查使用次数限制
    const rateLimitResult = await checkRateLimit(
      request,
      '/api/generate',
      user?.id
    )

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
            message: rateLimitResult.error || '请求过于频繁',
            details: {
              limit: rateLimitResult.limit,
              remaining: rateLimitResult.remaining,
              resetTime: rateLimitResult.resetTime.toISOString(),
            },
          },
        },
        { 
          status: HTTP_STATUS.TOO_MANY_REQUESTS,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetTime.getTime() / 1000).toString(),
          },
        }
      )
    }

    // 设置超时控制
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

      // 2. 根据认证状态应用限制
      const maxSuggestionsLimit = isAuthenticated
        ? API_LIMITS.MAX_SUGGESTIONS_AUTHENTICATED
        : API_LIMITS.MAX_SUGGESTIONS_GUEST // 未登录用户最多6个建议
      const actualMaxSuggestions = Math.min(
        options?.maxSuggestions || API_LIMITS.DEFAULT_SUGGESTIONS,
        maxSuggestionsLimit,
      )

      // 3. NLP 分析
      const analysisResult = await analyzeText(description)

      // 4. 生成项目名
      const projectNames = await generateProjectNames(
        analysisResult.keywords,
        analysisResult.semanticExtensions,
        {
          maxCount: actualMaxSuggestions,
          targetMarket:
            options?.targetMarket || GENERATION_OPTIONS.DEFAULT_TARGET_MARKET,
        },
      )

      // 5. 批量检查域名可用性
      const domainResults = await Promise.all(
        projectNames.map(async (projectName) => {
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

      // 6. 聚合和格式化结果
      const finalResults = aggregateResults(domainResults)

      return NextResponse.json(
        {
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
        },
        {
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': Math.max(0, rateLimitResult.remaining - 1).toString(),
            'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetTime.getTime() / 1000).toString(),
          },
        }
      )
    }

    // 使用 Promise.race 来实现超时控制
    return (await Promise.race([processPromise(), timeoutPromise])) as Response
  } catch (error) {
    console.error('Generate API Error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
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
    }

    // 处理超时错误
    if (error instanceof Error && error.message === 'Request timeout') {
      return NextResponse.json(
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
    }

    const isDev = process.env.NODE_ENV === 'development'

    return NextResponse.json(
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
  }
}
