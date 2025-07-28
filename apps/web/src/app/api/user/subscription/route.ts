import {
  COUNTERS,
  HTTP_STATUS,
  SUBSCRIPTION_LIMITS,
  SUBSCRIPTION_PLAN_LIMITS,
  USER_ERROR_MESSAGES,
} from '@/constants'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface BillingRecord {
  id: string
  date: string
  amount: string
  status: 'paid' | 'pending' | 'failed'
  plan: string
  period: string
}

export async function GET() {
  try {
    const supabase = await createClient()

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: USER_ERROR_MESSAGES.UNAUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED },
      )
    }

    // 获取用户的profile信息（包含订阅计划）
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_plan')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: USER_ERROR_MESSAGES.PROFILE_FETCH_FAILED },
        { status: HTTP_STATUS.INTERNAL_ERROR },
      )
    }

    // 获取当月API使用情况
    const currentMonth = new Date().toISOString().slice(0, 7)
    const startOfMonth = `${currentMonth}-01`

    // 获取用户的API密钥
    const { data: apiKeys, error: keysError } = await supabase
      .from('api_keys')
      .select('id')
      .eq('user_id', user.id)

    if (keysError) {
      return NextResponse.json(
        { error: USER_ERROR_MESSAGES.API_KEYS_FETCH_FAILED },
        { status: HTTP_STATUS.INTERNAL_ERROR },
      )
    }

    let monthlyUsage: number = COUNTERS.INITIAL_COUNT
    if (apiKeys && apiKeys.length > 0) {
      // 统计当月所有API密钥的使用量
      const keyIds = apiKeys.map((key) => key.id)
      const { count, error: usageError } = await supabase
        .from('api_key_usage')
        .select('*', { count: 'exact', head: true })
        .in('api_key_id', keyIds)
        .gte('created_at', startOfMonth)

      if (usageError) {
        console.error('获取使用情况失败:', usageError)
      } else {
        monthlyUsage = count ?? COUNTERS.INITIAL_COUNT
      }
    }

    // 获取账单历史（模拟数据，实际项目中需要集成支付系统）
    const billingHistory: BillingRecord[] = [
      // 实际项目中这里会从支付系统获取真实的账单记录
    ]

    // 根据订阅计划设置限制
    const planLimits = {
      [SUBSCRIPTION_LIMITS.FREE_PLAN]: {
        name: SUBSCRIPTION_PLAN_LIMITS.FREE.NAME,
        limit: SUBSCRIPTION_PLAN_LIMITS.FREE.LIMIT,
        apiLimit: SUBSCRIPTION_PLAN_LIMITS.FREE.API_LIMIT,
        price: SUBSCRIPTION_PLAN_LIMITS.FREE.PRICE,
        features: SUBSCRIPTION_PLAN_LIMITS.FREE.FEATURES,
      },
      [SUBSCRIPTION_LIMITS.PROFESSIONAL_PLAN]: {
        name: SUBSCRIPTION_PLAN_LIMITS.PRO.NAME,
        limit: SUBSCRIPTION_PLAN_LIMITS.PRO.LIMIT,
        apiLimit: SUBSCRIPTION_PLAN_LIMITS.PRO.API_LIMIT,
        price: SUBSCRIPTION_PLAN_LIMITS.PRO.PRICE,
        features: SUBSCRIPTION_PLAN_LIMITS.PRO.FEATURES,
      },
      [SUBSCRIPTION_LIMITS.ENTERPRISE_PLAN]: {
        name: SUBSCRIPTION_PLAN_LIMITS.ENTERPRISE.NAME,
        limit: SUBSCRIPTION_PLAN_LIMITS.ENTERPRISE.LIMIT,
        apiLimit: SUBSCRIPTION_PLAN_LIMITS.ENTERPRISE.API_LIMIT,
        price: SUBSCRIPTION_PLAN_LIMITS.ENTERPRISE.PRICE,
        features: SUBSCRIPTION_PLAN_LIMITS.ENTERPRISE.FEATURES,
      },
    }

    const currentPlan =
      profile?.subscription_plan || SUBSCRIPTION_LIMITS.FREE_PLAN
    const planInfo =
      planLimits[currentPlan as keyof typeof planLimits] ||
      planLimits[SUBSCRIPTION_LIMITS.FREE_PLAN]

    return NextResponse.json({
      success: true,
      data: {
        currentPlan: currentPlan,
        planInfo: planInfo,
        monthlyUsage: monthlyUsage,
        billingHistory: billingHistory,
        user: {
          id: user.id,
          email: user.email,
        },
      },
    })
  } catch (error) {
    console.error(USER_ERROR_MESSAGES.SUBSCRIPTION_FETCH_FAILED, error)
    return NextResponse.json(
      { error: USER_ERROR_MESSAGES.SERVER_ERROR },
      { status: HTTP_STATUS.INTERNAL_ERROR },
    )
  }
}
