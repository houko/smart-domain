import {
  COUNTERS,
  ERROR_CODES,
  HTTP_STATUS,
  SERVICE_CONFIG,
  SYSTEM_STATS,
  USER_ERROR_MESSAGES,
} from '@/constants'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest) {
  try {
    // 检查环境变量是否存在
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY not found in environment variables')
      throw new Error('Service role key not configured')
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('NEXT_PUBLIC_SUPABASE_URL not found in environment variables')
      throw new Error('Supabase URL not configured')
    }

    console.log('Stats API: Using service role key (last 4 chars):', process.env.SUPABASE_SERVICE_ROLE_KEY.slice(-4))

    // 使用服务角色客户端来绕过RLS限制，获取全局统计数据
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 同时保留普通客户端用于验证用户身份（可选）
    const supabase = await createClient()
    const {
      data: { user: _user },
    } = await supabase.auth.getUser()

    // 使用服务角色客户端获取全局统计数据（绕过RLS）
    
    // 优先使用数据库函数获取准确的用户统计
    console.log('Stats API: Using database function to get accurate user count...')
    
    let userCount = 0
    let userCountError = null
    
    // 尝试使用数据库函数获取用户数量
    const { data: statsData, error: statsError } = await serviceSupabase.rpc('get_system_stats')
    
    if (statsError) {
      console.log('Stats API: Database function failed:', statsError.message)
      console.log('Stats API: Falling back to direct queries...')
      
      // 回退方案：尝试直接查询auth.users表
      const { count: authUserCount, error: authUserError } = await serviceSupabase
        .from('auth.users')
        .select('*', { count: 'exact', head: true })

      if (authUserError) {
        console.log('Stats API: Cannot access auth.users directly:', authUserError.message)
        console.log('Stats API: Using profiles table as last resort...')
        
        // 最后的回退：使用profiles表
        const { count: profileCount, error: profileError } = await serviceSupabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
        
        if (profileError) {
          console.error('Error querying profiles table:', profileError)
          userCountError = profileError
        } else {
          userCount = profileCount || 0
          console.log('Stats API: Using profiles count as last resort:', userCount)
        }
      } else {
        userCount = authUserCount || 0
        console.log('Stats API: Got user count from auth.users:', userCount)
      }
    } else {
      userCount = statsData?.total_users || 0
      console.log('Stats API: Got accurate user count from database function:', userCount)
      console.log('Stats API: Additional stats from function:', {
        total_profiles: statsData?.total_profiles,
        total_favorites: statsData?.total_favorites,
        total_searches: statsData?.total_searches,
        today_searches: statsData?.today_searches
      })
    }

    // 如果数据库函数成功，使用其结果；否则进行单独查询
    let favoriteCount, searchCount, todaySearchCount
    
    if (statsData && !statsError) {
      // 使用数据库函数的结果
      favoriteCount = statsData.total_favorites
      searchCount = statsData.total_searches
      todaySearchCount = statsData.today_searches
      console.log('Stats API: Using all stats from database function')
    } else {
      // 进行单独查询
      console.log('Stats API: Performing individual queries for remaining stats...')
      
      // 获取总收藏数
      const { count: favCount } = await serviceSupabase
        .from('domain_favorites')
        .select('*', { count: 'exact', head: true })
      favoriteCount = favCount

      // 获取总搜索次数
      const { count: searchHistoryCount } = await serviceSupabase
        .from('search_history')
        .select('*', { count: 'exact', head: true })
      searchCount = searchHistoryCount

      // 获取今日搜索次数
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { count: todayCount } = await serviceSupabase
        .from('search_history')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())
      todaySearchCount = todayCount
    }

    // 计算服务可用性（这里使用固定值，实际应该从监控系统获取）
    const uptime = SYSTEM_STATS.DEFAULT_UPTIME

    // 计算总域名生成数（基于搜索历史的结果数）
    const { data: searchResults } = await serviceSupabase
      .from('search_history')
      .select('result_count')
      .not('result_count', 'is', null)

    const totalDomainsGenerated =
      searchResults?.reduce(
        (sum, item) => sum + (item.result_count || COUNTERS.INITIAL_COUNT),
        COUNTERS.INITIAL_COUNT,
      ) || COUNTERS.INITIAL_COUNT

    // 检查是否有关键错误
    if (userCountError) {
      console.error('Critical error in user count:', userCountError)
    }

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          total_users: userCount || COUNTERS.INITIAL_COUNT,
          total_favorites: favoriteCount || COUNTERS.INITIAL_COUNT,
          total_searches: searchCount || COUNTERS.INITIAL_COUNT,
          today_searches: todaySearchCount || COUNTERS.INITIAL_COUNT,
          total_domains_generated: totalDomainsGenerated,
          service_uptime: uptime,
          service_availability: SERVICE_CONFIG.SERVICE_AVAILABILITY,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ERROR_CODES.STATS_FETCH_ERROR,
          message: USER_ERROR_MESSAGES.STATS_FETCH_FAILED,
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: HTTP_STATUS.INTERNAL_ERROR },
    )
  }
}
