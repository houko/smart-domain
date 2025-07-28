'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import {
  Check,
  ExternalLink,
  Heart,
  History,
  Loader2,
  Search,
  X,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FORM_VALIDATION } from '@/constants'
import {
  useMaxSearchResults,
  useShowPricing,
  useStatsigEvents,
} from '@/hooks/use-statsig'
import { useToast } from '@/hooks/use-toast'
import {
  type DomainFavorite,
  favoritesApi,
  handleApiError,
  historyApi,
} from '@/lib/api-client'

const createFormSchema = (t: (key: string) => string) =>
  z.object({
    description: z
      .string()
      .min(FORM_VALIDATION.DESCRIPTION_MIN_LENGTH, t('validation.minLength'))
      .max(FORM_VALIDATION.DESCRIPTION_MAX_LENGTH, t('validation.maxLength')),
  })

type FormData = {
  description: string
}

interface DomainSuggestion {
  id: string
  name: string
  reasoning: string
  availableDomainCount: number
  domains: Array<{
    domain: string
    name?: string
    available?: boolean
    price?: string
    purchaseUrl?: string
  }>
}

interface GenerateResults {
  suggestions?: DomainSuggestion[]
  message?: string
  query?: string
  analysis: {
    keywords: string[]
  }
}

export function DomainGenerator() {
  const t = useTranslations('domainGenerator')
  const { toast } = useToast()
  const formSchema = createFormSchema(t)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<GenerateResults | null>(null)
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>(
    {},
  )
  const [favoriteIds, setFavoriteIds] = useState<Record<string, string>>({})
  const [favoritingDomains, setFavoritingDomains] = useState<Set<string>>(
    new Set(),
  )

  // Statsig功能标志
  const { enabled: showPricing } = useShowPricing()
  const { value: maxResults } = useMaxSearchResults()
  const { logSearchEvent, logFavoriteEvent } = useStatsigEvents()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setResults(null)
    setFavoriteStates({})
    setFavoriteIds({})

    try {
      const response = await axios.post('/api/generate', {
        description: data.description,
        options: {
          maxSuggestions: maxResults,
          includePricing: showPricing,
          targetMarket: 'global',
        },
      })

      setResults(response.data.data)

      // 记录搜索事件（Statsig）
      logSearchEvent(
        data.description,
        response.data.data.suggestions?.length || 0,
        'keyword',
      )

      // 检查收藏状态
      if (response.data.data.suggestions) {
        await checkFavoriteStates(response.data.data.suggestions)
      }

      // 保存搜索历史
      try {
        await historyApi.addSearchRecord({
          search_term: data.description,
          domain_results: response.data.data,
          result_count: response.data.data.suggestions?.length || 0,
          search_type: 'keyword',
        })
      } catch (historyError) {
        // 搜索历史保存失败不影响主流程
        console.warn(t('favorites.saveFailed'), historyError)
      }
    } catch (error) {
      console.error(t('generateError'), error)
      toast({
        title: t('generateError'),
        description: t('generateErrorDesc'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // 检查收藏状态
  const checkFavoriteStates = async (suggestions: DomainSuggestion[]) => {
    try {
      // 获取用户的所有收藏
      const response = await favoritesApi.getFavorites({ limit: 1000 })
      if (response.success && response.data) {
        const favorites: DomainFavorite[] = response.data.favorites
        const favoriteMap: Record<string, boolean> = {}
        const favoriteIdMap: Record<string, string> = {}

        // 检查每个域名是否已收藏
        for (const suggestion of suggestions) {
          if (suggestion.domains && Array.isArray(suggestion.domains)) {
            for (const domain of suggestion.domains) {
              const domainName = domain.domain || domain.name
              if (domainName) {
                const favorite = favorites.find(
                  (fav) => fav.domain === domainName,
                )
                if (favorite) {
                  favoriteMap[domainName] = true
                  favoriteIdMap[domainName] = favorite.id
                } else {
                  favoriteMap[domainName] = false
                }
              }
            }
          }
        }

        setFavoriteStates(favoriteMap)
        setFavoriteIds(favoriteIdMap)
      }
    } catch (error) {
      console.warn(t('favorites.checkFailed'), error)
    }
  }

  // 添加/移除收藏
  const handleToggleFavorite = async (
    domain: string | undefined,
    isAvailable: boolean | undefined,
  ) => {
    if (!domain) {
      return
    }
    const domainKey = domain
    const isCurrentlyFavorited = favoriteStates[domainKey]

    // 防止重复操作
    if (favoritingDomains.has(domainKey)) {
      return
    }

    setFavoritingDomains((prev) => new Set(prev).add(domainKey))

    try {
      if (isCurrentlyFavorited) {
        // 删除收藏
        const favoriteId = favoriteIds[domainKey]
        if (favoriteId) {
          const response = await favoritesApi.deleteFavorite(favoriteId)
          if (response.success) {
            setFavoriteStates((prev) => ({ ...prev, [domainKey]: false }))
            setFavoriteIds((prev) => {
              const newIds = { ...prev }
              delete newIds[domainKey]
              return newIds
            })
            // 记录取消收藏事件
            logFavoriteEvent(domain, 'remove')
            toast({
              title: t('favorites.removed'),
              description: t('favorites.removedDesc', { domain }),
            })
          } else {
            toast({
              title: t('favorites.removeFailed'),
              description: handleApiError(response),
              variant: 'destructive',
            })
          }
        }
      } else {
        // 添加收藏
        const response = await favoritesApi.addFavorite({
          domain,
          is_available: isAvailable,
          notes: t('favorites.searchNote', { query: results?.query || '' }),
        })

        if (response.success) {
          setFavoriteStates((prev) => ({ ...prev, [domainKey]: true }))
          if (response.data?.favorite?.id) {
            const favoriteId = response.data.favorite.id
            setFavoriteIds((prev) => ({
              ...prev,
              [domainKey]: favoriteId,
            }))
          }
          // 记录添加收藏事件
          logFavoriteEvent(domain, 'add')
          toast({
            title: t('favorites.added'),
            description: t('favorites.addedDesc', { domain }),
          })
        } else {
          toast({
            title: t('favorites.addFailed'),
            description: handleApiError(response),
            variant: 'destructive',
          })
        }
      }
    } catch (_error) {
      toast({
        title: t('favorites.addFailed'),
        description: t('favorites.operationFailed'),
        variant: 'destructive',
      })
    } finally {
      setFavoritingDomains((prev) => {
        const newSet = new Set(prev)
        newSet.delete(domainKey)
        return newSet
      })
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* 输入表单 - Modern Glass Style */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-3xl opacity-10 blur-xl group-hover:opacity-20 transition duration-1000" />
        <Card className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-3xl overflow-hidden">
          <CardHeader className="pb-6 pt-8">
            <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              {t('title')}
            </CardTitle>
            <CardDescription className="text-base md:text-lg text-gray-600 dark:text-gray-400 mt-2">
              {t('subtitle')}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pb-8">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Input
                    placeholder={t('placeholder')}
                    {...register('description')}
                    disabled={loading}
                    className="h-12 px-5 text-base bg-gray-50/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div className="relative flex justify-center sm:justify-start">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="relative h-12 px-8 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('generating')}
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        {t('generateButton')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
              {errors.description && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-2">
                  {errors.description.message}
                </p>
              )}
            </CardContent>
          </form>
        </Card>
      </div>

      {/* 结果展示 */}
      {results && (
        <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-10 duration-700">
          {/* 工具栏 - Modern Style */}
          <div className="backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {t('results.title')}
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-sm font-medium text-purple-700 dark:text-purple-300">
                  {t('results.foundSuggestions', {
                    count: results.suggestions?.length || 0,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="ghost"
                  asChild
                  className="backdrop-blur-sm bg-gray-100/50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                >
                  <a href="/settings/favorites">
                    <Heart className="mr-2 h-4 w-4" />
                    {t('results.myFavorites')}
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  asChild
                  className="backdrop-blur-sm bg-gray-100/50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                >
                  <a href="/settings/history">
                    <History className="mr-2 h-4 w-4" />
                    {t('results.searchHistory')}
                  </a>
                </Button>
              </div>
            </div>
          </div>
          {/* 分析结果 - Modern Glass Card */}
          <div className="relative group animate-in fade-in-50 slide-in-from-bottom-5 duration-700 delay-150">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition duration-300" />
            <Card className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold">
                  {t('analysis.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {t('analysis.keywords')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {results.analysis.keywords.map(
                        (keyword: string, index: number) => (
                          <span
                            key={keyword}
                            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/50 dark:border-purple-700/50 text-sm font-medium text-gray-700 dark:text-gray-300 animate-in fade-in-50 slide-in-from-bottom-5"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            {keyword}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 域名建议 - Modern Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {results.suggestions?.map((suggestion, idx) => (
              <div
                key={suggestion.id}
                className="group relative animate-in fade-in-50 slide-in-from-bottom-5 duration-700"
                style={{ animationDelay: `${(idx + 2) * 100}ms` }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-300" />
                <Card className="relative h-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                      {suggestion.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                      {suggestion.reasoning}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {suggestion.domains.slice(0, 5).map((domain, index) => (
                        <div
                          key={
                            domain.domain || domain.name || `domain-${index}`
                          }
                          className="group/item flex items-center justify-between rounded-xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 p-4 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`rounded-full p-1 ${
                                domain.available
                                  ? 'bg-green-100 dark:bg-green-900/30'
                                  : 'bg-gray-100 dark:bg-gray-800'
                              }`}
                            >
                              {domain.available ? (
                                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                              ) : (
                                <X className="h-4 w-4 text-gray-400 dark:text-gray-600" />
                              )}
                            </div>
                            <span
                              className={`font-medium ${
                                domain.available
                                  ? 'text-gray-900 dark:text-gray-100'
                                  : 'text-gray-400 dark:text-gray-600 line-through'
                              }`}
                            >
                              {domain.domain}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* 收藏按钮 */}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleToggleFavorite(
                                  domain.domain,
                                  domain.available,
                                )
                              }
                              disabled={favoritingDomains.has(domain.domain)}
                              className="rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                            >
                              {favoritingDomains.has(domain.domain) ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : favoriteStates[domain.domain] ? (
                                <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
                              ) : (
                                <Heart className="h-4 w-4 text-gray-400 hover:text-pink-500 transition-colors" />
                              )}
                            </Button>

                            {domain.available && (
                              <>
                                {showPricing && (
                                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    ${domain.price}
                                  </span>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  asChild
                                  className="rounded-lg backdrop-blur-sm bg-purple-100/50 dark:bg-purple-900/30 hover:bg-purple-200/50 dark:hover:bg-purple-800/30 text-purple-700 dark:text-purple-300"
                                >
                                  <a
                                    href={domain.purchaseUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {t('domains.purchase')}
                                    <ExternalLink className="ml-1 h-3 w-3" />
                                  </a>
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {t('domains.availableCount', {
                        count: suggestion.availableDomainCount,
                      })}
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
