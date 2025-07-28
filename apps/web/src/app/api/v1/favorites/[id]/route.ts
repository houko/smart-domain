import { createClient } from '@/lib/supabase/server'
import type { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'
import { z } from 'zod'

// 请求验证 schema
const updateFavoriteSchema = z.object({
  tags: z.array(z.string()).optional(),
  notes: z.string().max(500).optional(),
  is_available: z.boolean().optional(),
})

interface RouteParams {
  params: {
    id: string
  }
}

// GET - 获取单个收藏详情
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

    const { data: favorite, error } = await supabase
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
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return Response.json(
          {
            success: false,
            error: { code: 'NOT_FOUND', message: '收藏不存在' },
          },
          { status: 404 },
        )
      }

      console.error('Get favorite error:', error)
      return Response.json(
        {
          success: false,
          error: { code: 'DATABASE_ERROR', message: '查询收藏失败' },
        },
        { status: 500 },
      )
    }

    return Response.json({
      success: true,
      data: { favorite },
    })
  } catch (error) {
    console.error('GET favorite error:', error)
    return Response.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
      },
      { status: 500 },
    )
  }
}

// PUT - 更新收藏
export async function PUT(request: NextRequest, { params }: RouteParams) {
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
    const updates = updateFavoriteSchema.parse(body)

    // 准备更新数据
    const updateData: Record<string, unknown> = { ...updates }
    if (updates.is_available !== undefined) {
      updateData.last_checked_at = new Date().toISOString()
    }

    // 更新收藏
    const { data: favorite, error } = await supabase
      .from('domain_favorites')
      .update(updateData)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return Response.json(
          {
            success: false,
            error: { code: 'NOT_FOUND', message: '收藏不存在' },
          },
          { status: 404 },
        )
      }

      console.error('Update favorite error:', error)
      return Response.json(
        {
          success: false,
          error: { code: 'DATABASE_ERROR', message: '更新收藏失败' },
        },
        { status: 500 },
      )
    }

    return Response.json({
      success: true,
      data: { favorite },
    })
  } catch (error) {
    console.error('PUT favorite error:', error)

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

// DELETE - 删除单个收藏
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

    // 删除收藏
    const { error } = await supabase
      .from('domain_favorites')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Delete favorite error:', error)
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
      data: { message: '收藏已删除' },
    })
  } catch (error) {
    console.error('DELETE favorite error:', error)
    return Response.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' },
      },
      { status: 500 },
    )
  }
}
