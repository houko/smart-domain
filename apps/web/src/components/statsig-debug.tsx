'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useAISuggestions,
  useAdvancedSearch,
  useAnalyticsDashboard,
  useBatchOperations,
  useBetaFeatures,
  useMaxFavorites,
  useMaxSearchResults,
  usePremiumFeatures,
  useSearchTimeout,
  useSecurityCheck,
  useShowPricing,
  useStatsigInfo,
} from '@/hooks/use-statsig'
import { ChevronDown, Eye, EyeOff, Settings } from 'lucide-react'
import { useState } from 'react'

interface StatsigDebugProps {
  className?: string
}

interface ConfigParam {
  name: string
  key: string
  value: unknown
  isLoading: boolean
}

interface FeatureFlag {
  name: string
  key: string
  enabled: boolean
  isLoading: boolean
}

export function StatsigDebug({ className }: StatsigDebugProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showValues, setShowValues] = useState(false)

  // 功能标志状态
  const advancedSearch = useAdvancedSearch()
  const batchOps = useBatchOperations()
  const premiumFeatures = usePremiumFeatures()
  const showPricing = useShowPricing()
  const aiSuggestions = useAISuggestions()
  const securityCheck = useSecurityCheck()
  const analyticsDashboard = useAnalyticsDashboard()
  const betaFeatures = useBetaFeatures()

  // 配置参数
  const maxResults = useMaxSearchResults()
  const searchTimeout = useSearchTimeout()
  const maxFavorites = useMaxFavorites()

  // Statsig信息
  const { isInitialized, user } = useStatsigInfo()

  // 只在开发环境显示
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const featureFlags: FeatureFlag[] = [
    { name: '高级搜索', key: 'advanced_search', ...advancedSearch },
    { name: '批量操作', key: 'batch_operations', ...batchOps },
    { name: '高级功能', key: 'premium_features', ...premiumFeatures },
    { name: '显示价格', key: 'show_pricing', ...showPricing },
    { name: 'AI建议', key: 'ai_suggestions', ...aiSuggestions },
    { name: '安全检查', key: 'security_check', ...securityCheck },
    { name: '分析仪表板', key: 'analytics_dashboard', ...analyticsDashboard },
    { name: 'Beta功能', key: 'beta_features', ...betaFeatures },
  ]

  const configParams: ConfigParam[] = [
    { name: '最大搜索结果', key: 'max_results', ...maxResults },
    { name: '搜索超时(ms)', key: 'search_timeout', ...searchTimeout },
    { name: '最大收藏数', key: 'max_favorites', ...maxFavorites },
  ]

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          variant="outline"
          className="shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
        >
          <Settings className="h-4 w-4 mr-2" />
          Statsig
        </Button>
      ) : (
        <Card className="w-80 shadow-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Statsig 调试面板
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  onClick={() => setShowValues(!showValues)}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                >
                  {showValues ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant={isInitialized ? 'default' : 'secondary'}>
                {isInitialized ? '已初始化' : '未初始化'}
              </Badge>
              {user?.userID && (
                <Badge variant="outline" className="text-xs">
                  {user.userID}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {/* 功能标志 */}
            <div>
              <h4 className="text-xs font-medium mb-2 text-muted-foreground">
                功能标志
              </h4>
              <div className="space-y-1">
                {featureFlags.map((flag) => (
                  <div
                    key={flag.key}
                    className="flex items-center justify-between text-xs"
                  >
                    <span
                      className={flag.isLoading ? 'text-muted-foreground' : ''}
                    >
                      {flag.name}
                    </span>
                    <div className="flex items-center gap-1">
                      {flag.isLoading ? (
                        <Badge variant="outline" className="text-xs">
                          加载中
                        </Badge>
                      ) : (
                        <Badge
                          variant={flag.enabled ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {flag.enabled ? '启用' : '禁用'}
                        </Badge>
                      )}
                      {showValues && !flag.isLoading && (
                        <span className="text-xs font-mono text-muted-foreground">
                          {flag.enabled.toString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 配置参数 */}
            <div>
              <h4 className="text-xs font-medium mb-2 text-muted-foreground">
                配置参数
              </h4>
              <div className="space-y-1">
                {configParams.map((param) => (
                  <div
                    key={param.key}
                    className="flex items-center justify-between text-xs"
                  >
                    <span
                      className={param.isLoading ? 'text-muted-foreground' : ''}
                    >
                      {param.name}
                    </span>
                    <div className="flex items-center gap-1">
                      {param.isLoading ? (
                        <Badge variant="outline" className="text-xs">
                          加载中
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          {String(param.value)}
                        </Badge>
                      )}
                      {showValues && !param.isLoading && (
                        <span className="text-xs font-mono text-muted-foreground">
                          {typeof param.value === 'string'
                            ? `"${param.value}"`
                            : String(param.value)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-muted-foreground pt-2 border-t">
              💡 开发环境专用 - 生产环境不显示
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
