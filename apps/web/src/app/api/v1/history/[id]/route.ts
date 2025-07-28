import { createClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'

interface RouteParams {
  params: {
    id: string
  }
}

// GET - 获取单个搜索历史记录详情
export async function GET(_request: NextRequest, { params }: RouteParams) {
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

    const { data: history, error } = await supabase
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
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return Response.json(
          {
            success: false,
            error: { code: 'NOT_FOUND', message: '搜索记录不存在' },
          },
          { status: 404 },
        )
      }

      console.error('Get history error:', error)
      return Response.json(
        {
          success: false,
          error: { code: 'DATABASE_ERROR', message: '查询搜索记录失败' },
        },
        { status: 500 },
      )
    }

    return Response.json({
      success: true,
      data: { history },
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

// DELETE - 删除单个搜索历史记录
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
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

    // 删除搜索记录
    const { error } = await supabase
      .from('search_history')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Delete history error:', error)
      return Response.json(
        {
          success: false,
          error: { code: 'DATABASE_ERROR', message: '删除搜索记录失败' },
        },
        { status: 500 },
      )
    }

    return Response.json({
      success: true,
      data: { message: '搜索记录已删除' },
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
