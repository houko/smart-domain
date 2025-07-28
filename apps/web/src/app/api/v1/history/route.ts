import { createClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'
import { z } from 'zod'

// 请求验证 schema
const createHistorySchema = z.object({
  search_term: z.string().min(1).max(255),
  domain_results: z.any().optional(), // JSONB数据
  result_count: z.number().int().min(0).default(0),
  search_type: z.enum(['keyword', 'domain', 'company']).default('keyword'),
  filters: z.any().optional(), // JSONB数据
})

// GET - 获取用户的搜索历史
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 检查用户认证
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: '请先登录' },
        },
        { status: 401 },
      )
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get('page') || '1')
    const limit = Math.min(
      Number.parseInt(searchParams.get('limit') || '50'),
      100,
    )
    const offset = (page - 1) * limit
    const search = searchParams.get('search')
    const search_type = searchParams.get('search_type')

    // 构建查询
    let query = supabase
      .from('search_history')
      .select(`
        id,
        search_term,
        domain_results,
        result_count,
        search_type,
        filters,
        created_at
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // 应用过滤器
    if (search) {
      query = query.ilike('search_term', `%${search}%`)
    }

    if (search_type) {
      query = query.eq('search_type', search_type)
    }

    // 执行查询
    const { data: history, error } = await query.range(
      offset,
      offset + limit - 1,
    )

    if (error) {
      console.error('History query error:', error)
      return Response.json(
        {
          success: false,
          error: { code: 'DATABASE_ERROR', message: '查询搜索历史失败' },
        },
        { status: 500 },
      )
    }

    // 获取总数
    const { count, error: countError } = await supabase
      .from('search_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (countError) {
      console.error('History count error:', countError)
    }

    return Response.json({
      success: true,
      data: {
        history,
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: Math.ceil((count || 0) / limit),
        },
      },
    })
  } catch (error) {
    console.error('GET history error:', error)
    return Response.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
      },
      { status: 500 },
    )
  }
}

// POST - 添加搜索记录
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 检查用户认证
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: '请先登录' },
        },
        { status: 401 },
      )
    }

    // 验证请求数据
    const body = await request.json()
    const { search_term, domain_results, result_count, search_type, filters } =
      createHistorySchema.parse(body)

    // 检查是否存在相同的搜索记录（最近1小时内）
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { data: existing } = await supabase
      .from('search_history')
      .select('id')
      .eq('user_id', user.id)
      .eq('search_term', search_term)
      .eq('search_type', search_type)
      .gte('created_at', oneHourAgo)
      .single()

    // 如果存在相同搜索，则不重复添加
    if (existing) {
      return Response.json({
        success: true,
        data: { message: '搜索记录已存在，跳过重复添加' },
      })
    }

    // 添加搜索记录
    const { data: history, error } = await supabase
      .from('search_history')
      .insert({
        user_id: user.id,
        search_term,
        domain_results,
        result_count,
        search_type,
        filters,
      })
      .select()
      .single()

    if (error) {
      console.error('Create history error:', error)
      return Response.json(
        {
          success: false,
          error: { code: 'DATABASE_ERROR', message: '添加搜索记录失败' },
        },
        { status: 500 },
      )
    }

    return Response.json(
      {
        success: true,
        data: { history },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('POST history error:', error)

    if (error instanceof z.ZodError) {
      return Response.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '请求参数验证失败',
            details: error.errors,
          },
        },
        { status: 400 },
      )
    }

    return Response.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
      },
      { status: 500 },
    )
  }
}

// DELETE - 清空搜索历史或批量删除
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    // 检查用户认证
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: '请先登录' },
        },
        { status: 401 },
      )
    }

    const { searchParams } = new URL(request.url)
    const ids = searchParams.get('ids')?.split(',').filter(Boolean)
    const clearAll = searchParams.get('clear_all') === 'true'

    let query = supabase.from('search_history').delete().eq('user_id', user.id)

    if (clearAll) {
      // 清空所有历史记录
    } else if (ids && ids.length > 0) {
      // 删除指定的记录
      query = query.in('id', ids)
    } else {
      return Response.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: '请提供要删除的记录ID或设置清空标志',
          },
        },
        { status: 400 },
      )
    }

    const { error } = await query

    if (error) {
      console.error('Delete history error:', error)
      return Response.json(
        {
          success: false,
          error: { code: 'DATABASE_ERROR', message: '删除搜索历史失败' },
        },
        { status: 500 },
      )
    }

    return Response.json({
      success: true,
      data: {
        message: clearAll ? '所有搜索历史已清空' : '指定搜索记录已删除',
        deleted_count: clearAll ? null : ids?.length || 0,
      },
    })
  } catch (error) {
    console.error('DELETE history error:', error)
    return Response.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
      },
      { status: 500 },
    )
  }
}

// 获取搜索统计信息
export async function PATCH(_request: NextRequest) {
  try {
    const supabase = await createClient()

    // 检查用户认证
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: '请先登录' },
        },
        { status: 401 },
      )
    }

    // 获取统计信息
    const { data: stats, error } = await supabase.rpc('get_search_stats', {
      user_id_param: user.id,
    })

    if (error) {
      console.error('Get search stats error:', error)
      return Response.json(
        {
          success: false,
          error: { code: 'DATABASE_ERROR', message: '获取搜索统计失败' },
        },
        { status: 500 },
      )
    }

    return Response.json({
      success: true,
      data: { stats },
    })
  } catch (error) {
    console.error('PATCH history stats error:', error)
    return Response.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
      },
      { status: 500 },
    )
  }
}
