'use client'

import { API_LIMITS, API_TIMEOUTS } from '@/constants'

// 简化版 Statsig hooks - 使用默认值确保应用能正常运行

// 功能标志Hook
export function useFeatureFlag(_flagName: string, defaultValue = false) {
  return {
    enabled: defaultValue,
    isLoading: false,
  }
}

// 配置参数Hook
export function useConfigParam<T>(
  _paramName: string,
  defaultValue: T,
): {
  value: T
  isLoading: boolean
} {
  return {
    value: defaultValue,
    isLoading: false,
  }
}

// 预定义的功能标志Hooks
export function useAdvancedSearch() {
  return useFeatureFlag('enable_advanced_search', false)
}

export function useBatchOperations() {
  return useFeatureFlag('enable_batch_operations', true) // 默认启用
}

export function usePremiumFeatures() {
  return useFeatureFlag('enable_premium_features', false)
}

export function useShowPricing() {
  return useFeatureFlag('show_pricing_info', true) // 默认显示价格
}

export function useAISuggestions() {
  return useFeatureFlag('enable_ai_suggestions', true)
}

export function useSecurityCheck() {
  return useFeatureFlag('enable_security_check', false)
}

export function useAnalyticsDashboard() {
  return useFeatureFlag('show_analytics_dashboard', false)
}

export function useBetaFeatures() {
  return useFeatureFlag('enable_beta_features', false)
}

// 预定义的配置参数Hooks
export function useMaxSearchResults() {
  return useConfigParam('max_search_results', API_LIMITS.DEFAULT_SUGGESTIONS)
}

export function useSearchTimeout() {
  return useConfigParam('search_timeout_ms', API_TIMEOUTS.DEFAULT)
}

export function useMaxFavorites() {
  return useConfigParam('max_favorites', API_LIMITS.MAX_FAVORITES)
}

export function useApiRateLimit() {
  return useConfigParam('api_rate_limit', 60)
}

// Statsig 客户端和用户信息
export function useStatsigInfo() {
  return {
    client: null,
    user: { userID: 'anonymous' },
    isInitialized: false,
  }
}

// 事件记录Hook
export function useStatsigEvents() {
  const logEvent = (
    eventName: string,
    value?: string | number,
    metadata?: Record<string, string | number | boolean>,
  ) => {
    console.log('Statsig Event:', { eventName, value, metadata })
  }

  const logSearchEvent = (
    searchTerm: string,
    resultCount: number,
    searchType: string,
  ) => {
    logEvent('domain_search', searchTerm, {
      result_count: resultCount,
      search_type: searchType,
      timestamp: new Date().toISOString(),
    })
  }

  const logFavoriteEvent = (domain: string, action: 'add' | 'remove') => {
    logEvent('favorite_action', domain, {
      action,
      timestamp: new Date().toISOString(),
    })
  }

  const logPageView = (pageName: string) => {
    logEvent('page_view', pageName, {
      timestamp: new Date().toISOString(),
    })
  }

  return {
    logEvent,
    logSearchEvent,
    logFavoriteEvent,
    logPageView,
  }
}
