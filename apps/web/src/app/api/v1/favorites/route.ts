import { createClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// 请求验证 schema
const createFavoriteSchema = z.object({
  domain: z.string().min(1).max(255),
  tags: z.array(z.string()).optional(),
  notes: z.string().max(500).optional(),
  is_available: z.boolean().optional(),
})

// GET - 获取用户的域名收藏列表
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
      Number.parseInt(searchParams.get('limit') || '20'),
      100,
    )
    const offset = (page - 1) * limit
    const search = searchParams.get('search')
    const available = searchParams.get('available')

    // 构建查询
    let query = supabase
      .from('domain_favorites')
      .select(`
        id,
        domain,
        tags,
        notes,
        is_available,
        last_checked_at,
        created_at,
        updated_at
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // 应用过滤器
    if (search) {
      query = query.or(`domain.ilike.%${search}%,notes.ilike.%${search}%`)
    }

    if (available !== null) {
      if (available === 'true') {
        query = query.eq('is_available', true)
      } else if (available === 'false') {
        query = query.eq('is_available', false)
      }
    }

    // 执行查询
    const { data: favorites, error } = await query.range(
      offset,
      offset + limit - 1,
    )

    if (error) {
      console.error('Favorites query error:', error)
      return Response.json(
        {
          success: false,
          error: { code: 'DATABASE_ERROR', message: '查询收藏失败' },
        },
        { status: 500 },
      )
    }

    // 获取总数
    const { count, error: countError } = await supabase
      .from('domain_favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (countError) {
      console.error('Favorites count error:', countError)
    }

    return Response.json({
      success: true,
      data: {
        favorites,
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: Math.ceil((count || 0) / limit),
        },
      },
    })
  } catch (error) {
    console.error('GET favorites error:', error)
    return Response.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
      },
      { status: 500 },
    )
  }
}

// POST - 添加域名到收藏
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
    const { domain, tags, notes, is_available } =
      createFavoriteSchema.parse(body)

    // 检查是否已经收藏过
    const { data: existing } = await supabase
      .from('domain_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('domain', domain)
      .single()

    if (existing) {
      return Response.json(
        {
          success: false,
          error: { code: 'ALREADY_EXISTS', message: '该域名已在收藏列表中' },
        },
        { status: 400 },
      )
    }

    // 添加到收藏
    const { data: favorite, error } = await supabase
      .from('domain_favorites')
      .insert({
        user_id: user.id,
        domain,
        tags: tags || [],
        notes,
        is_available,
        last_checked_at:
          is_available !== undefined ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) {
      console.error('Create favorite error:', error)
      return Response.json(
        {
          success: false,
          error: { code: 'DATABASE_ERROR', message: '添加收藏失败' },
        },
        { status: 500 },
      )
    }

    return Response.json(
      {
        success: true,
        data: { favorite },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('POST favorites error:', error)

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

// DELETE - 批量删除收藏
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

    if (!ids || ids.length === 0) {
      return Response.json(
        {
          success: false,
          error: { code: 'INVALID_REQUEST', message: '请提供要删除的收藏ID' },
        },
        { status: 400 },
      )
    }

    // 删除收藏（只能删除自己的）
    const { error } = await supabase
      .from('domain_favorites')
      .delete()
      .eq('user_id', user.id)
      .in('id', ids)

    if (error) {
      console.error('Delete favorites error:', error)
      return Response.json(
        {
          success: false,
          error: { code: 'DATABASE_ERROR', message: '删除收藏失败' },
        },
        { status: 500 },
      )
    }

    return Response.json({
      success: true,
      data: { deleted_count: ids.length },
    })
  } catch (error) {
    console.error('DELETE favorites error:', error)
    return Response.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
      },
      { status: 500 },
    )
  }
}
