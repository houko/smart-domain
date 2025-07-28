// API客户端工具函数
export interface DomainFavorite {
  id: string
  domain: string
  tags: string[]
  notes?: string
  is_available?: boolean
  last_checked_at?: string
  created_at: string
  updated_at: string
}

export interface DomainResult {
  domain?: string
  name?: string
  url?: string
  available?: boolean
  price?: string
  description?: string
  tags?: string[]
}

export interface SearchHistory {
  id: string
  search_term: string
  domain_results?: DomainResult[] | string
  result_count: number
  search_type: 'keyword' | 'domain' | 'company'
  filters?: Record<string, unknown>
  created_at: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

export interface FavoritesResponse {
  success: boolean
  data?: {
    favorites: DomainFavorite[]
    pagination: {
      page: number
      limit: number
      total: number
      total_pages: number
    }
  }
  error?: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

export interface HistoryResponse {
  success: boolean
  data?: {
    history: SearchHistory[]
    pagination: {
      page: number
      limit: number
      total: number
      total_pages: number
    }
  }
  error?: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

// 域名收藏相关API
export const favoritesApi = {
  // 获取收藏列表
  async getFavorites(params?: {
    page?: number
    limit?: number
    search?: string
    available?: boolean
  }): Promise<FavoritesResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) {
      searchParams.set('page', params.page.toString())
    }
    if (params?.limit) {
      searchParams.set('limit', params.limit.toString())
    }
    if (params?.search) {
      searchParams.set('search', params.search)
    }
    if (params?.available !== undefined) {
      searchParams.set('available', params.available.toString())
    }

    const response = await fetch(`/api/v1/favorites?${searchParams}`)
    return response.json()
  },

  // 添加收藏
  async addFavorite(data: {
    domain: string
    tags?: string[]
    notes?: string
    is_available?: boolean
  }): Promise<ApiResponse<{ favorite: DomainFavorite }>> {
    const response = await fetch('/api/v1/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // 获取单个收藏
  async getFavorite(
    id: string,
  ): Promise<ApiResponse<{ favorite: DomainFavorite }>> {
    const response = await fetch(`/api/v1/favorites/${id}`)
    return response.json()
  },

  // 更新收藏
  async updateFavorite(
    id: string,
    data: {
      tags?: string[]
      notes?: string
      is_available?: boolean
    },
  ): Promise<ApiResponse<{ favorite: DomainFavorite }>> {
    const response = await fetch(`/api/v1/favorites/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // 删除单个收藏
  async deleteFavorite(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await fetch(`/api/v1/favorites/${id}`, {
      method: 'DELETE',
    })
    return response.json()
  },

  // 批量删除收藏
  async deleteFavorites(
    ids: string[],
  ): Promise<ApiResponse<{ deleted_count: number }>> {
    const searchParams = new URLSearchParams()
    searchParams.set('ids', ids.join(','))

    const response = await fetch(`/api/v1/favorites?${searchParams}`, {
      method: 'DELETE',
    })
    return response.json()
  },
}

// 搜索历史相关API
export const historyApi = {
  // 获取搜索历史
  async getHistory(params?: {
    page?: number
    limit?: number
    search?: string
    search_type?: string
  }): Promise<HistoryResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) {
      searchParams.set('page', params.page.toString())
    }
    if (params?.limit) {
      searchParams.set('limit', params.limit.toString())
    }
    if (params?.search) {
      searchParams.set('search', params.search)
    }
    if (params?.search_type) {
      searchParams.set('search_type', params.search_type)
    }

    const response = await fetch(`/api/v1/history?${searchParams}`)
    return response.json()
  },

  // 添加搜索记录
  async addSearchRecord(data: {
    search_term: string
    domain_results?: DomainResult[] | string
    result_count?: number
    search_type?: 'keyword' | 'domain' | 'company'
    filters?: Record<string, unknown>
  }): Promise<ApiResponse<{ history: SearchHistory }>> {
    const response = await fetch('/api/v1/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // 获取单个搜索记录
  async getHistoryItem(
    id: string,
  ): Promise<ApiResponse<{ history: SearchHistory }>> {
    const response = await fetch(`/api/v1/history/${id}`)
    return response.json()
  },

  // 删除单个搜索记录
  async deleteHistoryItem(
    id: string,
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await fetch(`/api/v1/history/${id}`, {
      method: 'DELETE',
    })
    return response.json()
  },

  // 批量删除或清空历史
  async deleteHistory(params?: {
    ids?: string[]
    clearAll?: boolean
  }): Promise<ApiResponse<{ message: string; deleted_count?: number }>> {
    const searchParams = new URLSearchParams()
    if (params?.ids && params.ids.length > 0) {
      searchParams.set('ids', params.ids.join(','))
    }
    if (params?.clearAll) {
      searchParams.set('clear_all', 'true')
    }

    const response = await fetch(`/api/v1/history?${searchParams}`, {
      method: 'DELETE',
    })
    return response.json()
  },

  // 获取搜索统计
  async getSearchStats(): Promise<
    ApiResponse<{ stats: Record<string, unknown> }>
  > {
    const response = await fetch('/api/v1/history', {
      method: 'PATCH',
    })
    return response.json()
  },
}

// 统计数据接口
export interface SystemStats {
  total_users: number
  total_favorites: number
  total_searches: number
  today_searches: number
  total_domains_generated: number
  service_uptime: number
  service_availability: string
}

export const statsApi = {
  // 获取系统统计数据
  async getSystemStats(): Promise<ApiResponse<{ stats: SystemStats }>> {
    const response = await fetch('/api/v1/stats')
    return response.json()
  },
}

// 通用错误处理
export function handleApiError(error: unknown): string {
  if (error && typeof error === 'object' && 'error' in error) {
    const errorObj = error as { error?: { message?: string } }
    if (errorObj.error?.message) {
      return errorObj.error.message
    }
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const errorWithMessage = error as { message: string }
    return errorWithMessage.message
  }
  return '操作失败，请稍后重试'
}
