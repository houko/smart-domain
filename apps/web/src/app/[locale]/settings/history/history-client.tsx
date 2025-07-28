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
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import {
  type SearchHistory,
  handleApiError,
  historyApi,
} from '@/lib/api-client'
import {
  Calendar,
  Clock,
  Database,
  ExternalLink,
  Filter,
  Loader2,
  RotateCcw,
  Search,
  Target,
  Trash2,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

export function HistoryClient() {
  const t = useTranslations('history')
  const { toast } = useToast()
  const [histories, setHistories] = useState<SearchHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('')

  // 加载搜索历史
  const loadHistories = useCallback(async () => {
    try {
      setLoading(true)
      const response = await historyApi.getHistory()

      if (response.success && response.data) {
        setHistories(response.data.history)
      } else {
        toast({
          title: t('loadFailed'),
          description: handleApiError(response),
          variant: 'destructive',
        })
      }
    } catch (_error) {
      toast({
        title: t('loadFailed'),
        description: t('loadFailedDesc'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast, t])

  useEffect(() => {
    loadHistories()
  }, [loadHistories])

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    )

    if (diffInHours < 1) {
      return t('detail.timeAgo.justNow')
    }
    if (diffInHours < 24) {
      return t('detail.timeAgo.hoursAgo', { hours: diffInHours })
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) {
      return t('detail.timeAgo.daysAgo', { days: diffInDays })
    }

    return date.toLocaleDateString('zh-CN')
  }

  const getSearchTypeLabel = (type: string) => {
    switch (type) {
      case 'keyword':
        return t('detail.searchType.keyword')
      case 'domain':
        return t('detail.searchType.domain')
      case 'company':
        return t('detail.searchType.company')
      default:
        return type
    }
  }

  const handleDeleteHistory = async (historyId: string) => {
    try {
      const response = await historyApi.deleteHistoryItem(historyId)

      if (response.success) {
        setHistories(histories.filter((h) => h.id !== historyId))
        toast({
          title: '删除成功',
          description: '搜索记录已删除',
        })
      } else {
        toast({
          title: '删除失败',
          description: handleApiError(response),
          variant: 'destructive',
        })
      }
    } catch (_error) {
      toast({
        title: '删除失败',
        description: '无法删除搜索记录，请稍后重试',
        variant: 'destructive',
      })
    }
  }

  const handleRepeatSearch = (searchTerm: string) => {
    window.open(`/?q=${encodeURIComponent(searchTerm)}`, '_self')
  }

  // 过滤历史记录
  const filteredHistories = histories.filter((history) => {
    const matchesSearch = searchTerm
      ? history.search_term.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    const matchesType = selectedType
      ? history.search_type === selectedType
      : true
    return matchesSearch && matchesType
  })

  const searchTypes = Array.from(new Set(histories.map((h) => h.search_type)))

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

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{t('title')}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        {/* 搜索和过滤 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {t('filters.title')}
            </CardTitle>
            <CardDescription>{t('filters.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <div className="flex-1">
                <Input
                  placeholder={t('filters.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedType === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType('')}
                  className="flex-1 sm:flex-none"
                >
                  <span className="hidden sm:inline">
                    {t('filters.allTypes')}
                  </span>
                  <span className="sm:hidden">{t('filters.all')}</span>
                </Button>
                {searchTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    className="flex-1 sm:flex-none"
                  >
                    <span className="hidden sm:inline">
                      {getSearchTypeLabel(type)}
                    </span>
                    <span className="sm:hidden">
                      {getSearchTypeLabel(type).slice(0, 2)}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredHistories.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">{t('noResults.title')}</p>
              <p className="text-sm text-muted-foreground">
                {t('noResults.subtitle')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredHistories.map((history) => (
              <Card
                key={history.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <Link
                          href={`/settings/history/${history.id}`}
                          className="text-lg font-semibold hover:text-primary transition-colors break-all"
                        >
                          {history.search_term}
                        </Link>
                        <div className="flex flex-wrap gap-2">
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
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{getTimeAgo(history.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(history.created_at).toLocaleString(
                              'zh-CN',
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRepeatSearch(history.search_term)}
                        className="flex-1 sm:flex-none"
                      >
                        <RotateCcw className="h-4 w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">重新搜索</span>
                        <span className="sm:hidden">重搜</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex-1 sm:flex-none"
                      >
                        <Link href={`/settings/history/${history.id}`}>
                          <ExternalLink className="h-4 w-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">查看详情</span>
                          <span className="sm:hidden">详情</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteHistory(history.id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
