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
  type DomainFavorite,
  favoritesApi,
  handleApiError,
} from '@/lib/api-client'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit3,
  ExternalLink,
  FileText,
  Globe,
  Heart,
  Loader2,
  Tag,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export default function FavoriteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations('favoritesPage.detail')
  const [favorite, setFavorite] = useState<DomainFavorite | null>(null)
  const [loading, setLoading] = useState(true)

  const favoriteId = params.id as string

  // 加载收藏详情
  const loadFavoriteDetail = useCallback(async () => {
    try {
      setLoading(true)
      const response = await favoritesApi.getFavorite(favoriteId)

      if (response.success && response.data) {
        setFavorite(response.data.favorite)
      } else {
        toast({
          title: t('loadFailed'),
          description: handleApiError(response),
          variant: 'destructive',
        })
        router.push('/settings/favorites')
      }
    } catch (_error) {
      toast({
        title: t('loadFailed'),
        description: t('loadFailedDesc'),
        variant: 'destructive',
      })
      router.push('/settings/favorites')
    } finally {
      setLoading(false)
    }
  }, [favoriteId, toast, t, router])

  useEffect(() => {
    if (favoriteId) {
      loadFavoriteDetail()
    }
  }, [favoriteId, loadFavoriteDetail])

  const getStatusBadge = (isAvailable: boolean | undefined) => {
    if (isAvailable === true) {
      return (
        <Badge variant="default" className="bg-green-500">
          {t('availability.available')}
        </Badge>
      )
    }
    if (isAvailable === false) {
      return <Badge variant="secondary">{t('availability.registered')}</Badge>
    }
    return <Badge variant="outline">{t('availability.unchecked')}</Badge>
  }

  const getTLD = (domain: string) => {
    const parts = domain.split('.')
    return parts.length > 1 ? `.${parts[parts.length - 1]}` : ''
  }

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

  const handleCheckAvailability = () => {
    if (!favorite) {
      return
    }
    toast({
      title: t('checking'),
      description: t('checkingDesc', { domain: favorite.domain }),
    })
    // 这里实际应该调用域名检查API
  }

  const handleEdit = () => {
    router.push(`/settings/favorites?edit=${favoriteId}`)
  }

  const getDomainType = (domain: string) => {
    const baseDomain = domain.split('.')[0]
    if (/^[a-zA-Z]+$/.test(baseDomain)) {
      return t('domainInfo.domainTypeValues.lettersOnly')
    }
    if (/^[0-9]+$/.test(baseDomain)) {
      return t('domainInfo.domainTypeValues.numbersOnly')
    }
    if (/^[a-zA-Z0-9]+$/.test(baseDomain)) {
      return t('domainInfo.domainTypeValues.alphanumeric')
    }
    return t('domainInfo.domainTypeValues.withSpecialChars')
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

  if (!favorite) {
    return (
      <AuthGuard>
        <div className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">{t('notFound')}</p>
              <Button
                className="mt-4"
                onClick={() => router.push('/settings/favorites')}
              >
                {t('backToFavorites')}
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
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{t('title')}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
        </div>

        {/* 主要信息 */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-xl sm:text-2xl break-all">
                  {favorite.domain}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(favorite.is_available)}
                  <Badge variant="outline">
                    <Globe className="h-3 w-3 mr-1" />
                    {getTLD(favorite.domain)}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="flex-1 sm:flex-none"
                >
                  <Edit3 className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{t('edit')}</span>
                  <span className="sm:hidden">{t('edit')}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCheckAvailability}
                  className="flex-1 sm:flex-none"
                >
                  <ExternalLink className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {t('checkAvailability')}
                  </span>
                  <span className="sm:hidden">{t('checkAvailability')}</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 标签 */}
            {favorite.tags && favorite.tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  {t('tags')}
                </h3>
                <div className="flex gap-1 flex-wrap">
                  {favorite.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 备注 */}
            {favorite.notes && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t('notes')}
                </h3>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">
                    {favorite.notes}
                  </p>
                </div>
              </div>
            )}

            {/* 时间信息 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t('favoriteTime')}
                </h3>
                <div className="text-sm text-muted-foreground">
                  <p>{new Date(favorite.created_at).toLocaleString()}</p>
                  <p className="text-xs">{getTimeAgo(favorite.created_at)}</p>
                </div>
              </div>

              {favorite.last_checked_at && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t('lastChecked')}
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    <p>{new Date(favorite.last_checked_at).toLocaleString()}</p>
                    <p className="text-xs">
                      {getTimeAgo(favorite.last_checked_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 域名信息 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('domainInfo.title')}</CardTitle>
            <CardDescription>
              {t('domainInfo.subtitle', { domain: favorite.domain })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">
                  {t('domainInfo.domainLength')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('domainInfo.domainLengthValue', {
                    length: favorite.domain.length,
                  })}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">{t('domainInfo.tld')}</h4>
                <p className="text-sm text-muted-foreground">
                  {getTLD(favorite.domain)}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">
                  {t('domainInfo.baseLength')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('domainInfo.baseLengthValue', {
                    length: favorite.domain.split('.')[0].length,
                  })}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">
                  {t('domainInfo.domainType')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {getDomainType(favorite.domain)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
