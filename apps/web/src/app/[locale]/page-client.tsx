'use client'

import { DomainGenerator } from '@/components/domain-generator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { type SystemStats, statsApi } from '@/lib/api-client'
import {
  ArrowRight,
  Heart,
  History,
  Loader2,
  Rocket,
  Shield,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function HomePageClient() {
  const t = useTranslations('home')
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await statsApi.getSystemStats()
      if (response.success && response.data) {
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const scrollToGenerator = () => {
    const generatorSection = document.getElementById('domain-generator')
    if (generatorSection) {
      generatorSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M+`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K+`
    }
    return num.toString()
  }

  return (
    <div className="relative">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="container relative flex flex-col items-center justify-center gap-6 md:gap-8 pb-12 md:pb-16 pt-16 md:pt-20 lg:pt-32 px-4">
          <div className="flex max-w-[980px] flex-col items-center gap-3 md:gap-4 text-center">
            <Badge
              variant="secondary"
              className="mb-3 md:mb-4 text-xs md:text-sm"
            >
              <Sparkles className="mr-1 md:mr-2 h-3 w-3" />
              {t('subtitle')}
            </Badge>
            <h1 className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight text-transparent dark:from-gray-100 dark:via-gray-300 dark:to-gray-500">
              {t('hero.findPerfect')}
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('hero.domain')}
              </span>
            </h1>
            <p className="max-w-[700px] text-base md:text-lg lg:text-xl text-muted-foreground px-4">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 md:gap-6 w-full sm:w-auto">
              <Button
                size="lg"
                className="group w-full sm:w-auto"
                onClick={scrollToGenerator}
              >
                {t('hero.startButton')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full sm:w-auto"
              >
                <Link href="/settings/favorites">
                  <Heart className="mr-2 h-4 w-4" />
                  {t('myFavorites')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Generator Section */}
      <section id="domain-generator" className="container py-12 md:py-16">
        <DomainGenerator />
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
        <div className="container py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t('whyChooseUs.title')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('whyChooseUs.subtitle')}
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* AI 智能分析 */}
            <Card className="group border-2 transition-all duration-300 hover:border-blue-200 hover:shadow-lg dark:hover:border-blue-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                    <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {t('features.aiAnalysis.title')}
                    </CardTitle>
                    <CardDescription>
                      {t('features.aiAnalysis.description')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('features.aiAnalysis.content')}
                </p>
              </CardContent>
            </Card>

            {/* 多策略命名 */}
            <Card className="group border-2 transition-all duration-300 hover:border-purple-200 hover:shadow-lg dark:hover:border-purple-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                    <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {t('features.multiStrategy.title')}
                    </CardTitle>
                    <CardDescription>
                      {t('features.multiStrategy.description')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('features.multiStrategy.content')}
                </p>
              </CardContent>
            </Card>

            {/* 实时查询 */}
            <Card className="group border-2 transition-all duration-300 hover:border-green-200 hover:shadow-lg dark:hover:border-green-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                    <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {t('features.realTimeQuery.title')}
                    </CardTitle>
                    <CardDescription>
                      {t('features.realTimeQuery.description')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('features.realTimeQuery.content')}
                </p>
              </CardContent>
            </Card>

            {/* 智能收藏 */}
            <Card className="group border-2 transition-all duration-300 hover:border-red-200 hover:shadow-lg dark:hover:border-red-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
                    <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {t('features.smartFavorites.title')}
                    </CardTitle>
                    <CardDescription>
                      {t('features.smartFavorites.description')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('features.smartFavorites.content')}
                </p>
                {stats && stats.total_favorites > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('features.smartFavorites.statsText', {
                      count: formatNumber(stats.total_favorites),
                    })}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* 搜索历史 */}
            <Card className="group border-2 transition-all duration-300 hover:border-orange-200 hover:shadow-lg dark:hover:border-orange-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                    <History className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {t('features.searchHistory.title')}
                    </CardTitle>
                    <CardDescription>
                      {t('features.searchHistory.description')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('features.searchHistory.content')}
                </p>
                {stats && stats.today_searches > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('features.searchHistory.statsText', {
                      count: formatNumber(stats.today_searches),
                    })}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* 安全可靠 */}
            <Card className="group border-2 transition-all duration-300 hover:border-gray-200 hover:shadow-lg dark:hover:border-gray-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                    <Shield className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {t('features.secure.title')}
                    </CardTitle>
                    <CardDescription>
                      {t('features.secure.description')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('features.secure.content')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container py-16 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">{t('stats.title')}</h2>
            <p className="text-lg opacity-90 mb-12">
              {stats && stats.total_users > 0
                ? t('stats.usersHelped', {
                    count: formatNumber(stats.total_users),
                  })
                : t('stats.usersHelpedDefault')}
            </p>
            {statsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    {stats ? formatNumber(stats.total_domains_generated) : '0'}
                  </div>
                  <div className="text-sm opacity-80">
                    {t('stats.domainsGenerated')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    {stats ? formatNumber(stats.total_users) : '0'}
                  </div>
                  <div className="text-sm opacity-80">
                    {t('stats.usersTrust')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    {stats ? `${stats.service_uptime}%` : '99.9%'}
                  </div>
                  <div className="text-sm opacity-80">
                    {t('stats.availability')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    {stats ? stats.service_availability : '24/7'}
                  </div>
                  <div className="text-sm opacity-80">
                    {t('stats.onlineService')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center">
            <Button size="lg" className="group" onClick={scrollToGenerator}>
              <Rocket className="mr-2 h-4 w-4" />
              {t('cta.startButton')}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/settings/history">
                <History className="mr-2 h-4 w-4" />
                {t('cta.demoButton')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
