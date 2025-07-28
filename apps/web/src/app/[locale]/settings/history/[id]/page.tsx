'use client'

import { AuthGuard } from '@/components/auth-guard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import {
  type DomainResult,
  type SearchHistory,
  favoritesApi,
  handleApiError,
  historyApi,
} from '@/lib/api-client'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Database,
  ExternalLink,
  Filter,
  Heart,
  Loader2,
  RotateCcw,
  Search,
  Target,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export default function HistoryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations('history.detail')
  const [history, setHistory] = useState<SearchHistory | null>(null)
  const [loading, setLoading] = useState(true)

  const historyId = params.id as string

  // 加载搜索历史详情
  const loadHistoryDetail = useCallback(async () => {
    try {
      setLoading(true)
      const response = await historyApi.getHistoryItem(historyId)

      if (response.success && response.data) {
        setHistory(response.data.history)
      } else {
        toast({
          title: t('loadFailed'),
          description: handleApiError(response),
          variant: 'destructive',
        })
        router.push('/settings/history')
      }
    } catch (_error) {
      toast({
        title: t('loadFailed'),
        description: t('loadFailedDesc'),
        variant: 'destructive',
      })
      router.push('/settings/history')
    } finally {
      setLoading(false)
    }
  }, [historyId, toast, t, router])

  useEffect(() => {
    if (historyId) {
      loadHistoryDetail()
    }
  }, [historyId, loadHistoryDetail])

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    )

    if (diffInHours < 1) {
      return t('timeAgo.justNow')
    }
    if (diffInHours < 24) {
      return t('timeAgo.hoursAgo', { hours: diffInHours })
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return t('timeAgo.daysAgo', { days: diffInDays })
    }

    return date.toLocaleDateString()
  }

  const getSearchTypeLabel = (type: string) => {
    switch (type) {
      case 'keyword':
        return t('searchType.keyword')
      case 'domain':
        return t('searchType.domain')
      case 'company':
        return t('searchType.company')
      default:
        return type
    }
  }

  const handleRepeatSearch = () => {
    if (!history) {
      return
    }
    window.open(`/?q=${encodeURIComponent(history.search_term)}`, '_self')
  }

  const handleAddToFavorites = async (domain: string) => {
    try {
      const response = await favoritesApi.addFavorite({
        domain,
        tags: ['从搜索历史添加'],
      })

      if (response.success) {
        toast({
          title: t('addSuccess'),
          description: t('addSuccessDesc', { domain }),
        })
      } else {
        toast({
          title: t('addFailed'),
          description: handleApiError(response),
          variant: 'destructive',
        })
      }
    } catch (_error) {
      toast({
        title: t('addFailed'),
        description: t('addFailedDesc'),
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="space-y-6">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">{t('loading')}</span>
            </CardContent>
          </Card>
        </div>
      </AuthGuard>
    )
  }

  if (!history) {
    return (
      <AuthGuard>
        <div className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">{t('notFound')}</p>
              <Button
                className="mt-4"
                onClick={() => router.push('/settings/history')}
              >
                {t('backToHistory')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('back')}
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">{t('title')}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t('subtitle', { searchTerm: history?.search_term })}
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="default"
              size="sm"
              onClick={handleRepeatSearch}
              className="flex-1 sm:flex-none"
            >
              <RotateCcw className="h-4 w-4 mr-1 sm:mr-2" />
              {t('repeatSearch')}
            </Button>
          </div>
        </div>

        {/* 搜索信息 */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                  <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="break-all">{history.search_term}</span>
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">
                    <Target className="h-3 w-3 mr-1" />
                    {getSearchTypeLabel(history.search_type)}
                  </Badge>
                  <Badge variant="secondary">
                    <Database className="h-3 w-3 mr-1" />
                    {history.result_count} 个结果
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRepeatSearch}
                className="hidden sm:flex"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {t('repeatSearch')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 搜索参数 */}
            {history.filters && Object.keys(history.filters).length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  {t('searchParams')}
                </h3>
                <div className="p-3 bg-gray-50 rounded-md">
                  <pre className="text-sm text-muted-foreground overflow-auto">
                    {JSON.stringify(history.filters, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* 时间信息 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t('searchTime')}
                </h3>
                <div className="text-sm text-muted-foreground">
                  <p>{new Date(history.created_at).toLocaleString()}</p>
                  <p className="text-xs">{getTimeAgo(history.created_at)}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {t('searchId')}
                </h3>
                <div className="text-sm text-muted-foreground">
                  <p className="font-mono text-xs">{history.id}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 搜索结果 - 主要内容 */}
        {history.domain_results && (
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Database className="h-5 w-5" />
                {t('resultReplay')}
              </CardTitle>
              <CardDescription className="text-blue-700">
                {t('resultReplayDesc', { count: history.result_count })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {typeof history.domain_results === 'string' ? (
                <div className="p-4 bg-white rounded-md border">
                  <pre className="text-sm overflow-auto whitespace-pre-wrap">
                    {history.domain_results}
                  </pre>
                </div>
              ) : Array.isArray(history.domain_results) ? (
                <div className="space-y-4">
                  {/* 结果统计 */}
                  <div className="flex items-center justify-between p-3 bg-white rounded-md border">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-blue-700">
                        共 {history.domain_results.length} 个域名建议
                      </span>
                      {Array.isArray(history.domain_results) &&
                        history.domain_results.filter(
                          (r: DomainResult) => r.available === true,
                        ).length > 0 && (
                          <span className="text-sm text-green-600">
                            {
                              history.domain_results.filter(
                                (r: DomainResult) => r.available === true,
                              ).length
                            }{' '}
                            个可用
                          </span>
                        )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (Array.isArray(history.domain_results)) {
                          const availableDomains = history.domain_results
                            .filter(
                              (r: DomainResult) =>
                                r.available === true && r.domain,
                            )
                            .slice(0, 5)
                          for (const result of availableDomains) {
                            const domain = result.domain
                            if (domain) {
                              setTimeout(
                                () => handleAddToFavorites(domain),
                                100,
                              )
                            }
                          }
                        }
                      }}
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {t('batchAddFavorites')}
                    </Button>
                  </div>

                  {/* 域名列表 - 类似原始搜索结果 */}
                  <div className="grid gap-3">
                    {Array.isArray(history.domain_results) &&
                      history.domain_results.map(
                        (result: DomainResult, index: number) => {
                          const domainName = result.domain || result.name
                          const isAvailable = result.available

                          return (
                            <Card
                              key={domainName || `result-${index}`}
                              className={`bg-white hover:shadow-md transition-shadow ${
                                isAvailable === true
                                  ? 'border-green-200 hover:border-green-300'
                                  : isAvailable === false
                                    ? 'border-gray-200'
                                    : 'border-blue-200'
                              }`}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-3">
                                      <h4 className="text-lg font-semibold text-gray-900">
                                        {domainName || `结果 ${index + 1}`}
                                      </h4>
                                      {isAvailable !== undefined && (
                                        <Badge
                                          variant={
                                            isAvailable
                                              ? 'default'
                                              : 'secondary'
                                          }
                                          className={
                                            isAvailable
                                              ? 'bg-green-500 hover:bg-green-600'
                                              : ''
                                          }
                                        >
                                          {isAvailable
                                            ? t('availability.available')
                                            : t('availability.registered')}
                                        </Badge>
                                      )}
                                      {result.price && (
                                        <Badge
                                          variant="outline"
                                          className="text-blue-600"
                                        >
                                          {result.price}
                                        </Badge>
                                      )}
                                    </div>

                                    {result.description && (
                                      <p className="text-sm text-gray-600">
                                        {result.description}
                                      </p>
                                    )}

                                    {result.tags && result.tags.length > 0 && (
                                      <div className="flex gap-1 flex-wrap">
                                        {result.tags.map((tag: string) => (
                                          <Badge
                                            key={tag}
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex gap-2 ml-4">
                                    {domainName && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          handleAddToFavorites(domainName)
                                        }
                                        title={t('addToFavorites')}
                                      >
                                        <Heart className="h-4 w-4" />
                                      </Button>
                                    )}
                                    {(domainName || result.url) && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          window.open(
                                            result.url ||
                                              `https://${domainName}`,
                                            '_blank',
                                          )
                                        }
                                        title={t('visitDomain')}
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        },
                      )}
                  </div>
                </div>
              ) : history.domain_results ? (
                <div className="p-4 bg-white rounded-md border">
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      搜索结果数据：
                    </h4>
                  </div>
                  <pre className="text-sm overflow-auto bg-gray-50 p-3 rounded">
                    {JSON.stringify(history.domain_results, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">{t('noResultsData')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 统计信息 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('stats.title')}</CardTitle>
            <CardDescription>{t('stats.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-md">
                <p className="text-xl font-bold">{history.result_count}</p>
                <p className="text-xs text-muted-foreground">
                  {t('stats.totalResults')}
                </p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-md">
                <p className="text-xl font-bold">
                  {getSearchTypeLabel(history.search_type)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('stats.searchType')}
                </p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-md">
                <p className="text-xl font-bold">
                  {history.search_term.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('stats.searchTermLength')}
                </p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-md">
                <p className="text-xl font-bold">
                  {history.filters ? Object.keys(history.filters).length : 0}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('stats.filterCount')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
