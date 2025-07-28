'use client'

import { DomainGenerator } from '@/components/domain-generator'
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
  Clock,
  Heart,
  History,
  Lightbulb,
  Loader2,
  Lock,
  Palette,
  Play,
  Search,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function DomainGeneratorWrapper() {
  const t = useTranslations('home')
  const locale = useLocale()

  // Helper function to generate locale-aware paths
  const localePath = (path: string) => {
    return locale === 'zh' ? path : `/${locale}${path}`
  }
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    loadStats()
  }, [])

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
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
      {/* Hero Section with Modern Design */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white dark:bg-gray-900">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-cyan-50 dark:from-purple-950/20 dark:via-transparent dark:to-cyan-950/20 animate-gradient-shift" />

        {/* 3D Grid Background with Perspective */}
        <div className="absolute inset-0 [perspective:1000px]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] [transform:rotateX(35deg)] animate-grid-float" />
        </div>

        {/* Animated Gradient Orbs with Parallax */}
        <div
          className="absolute -inset-x-40 -inset-y-40 transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
          }}
        >
          <div className="absolute top-0 -left-4 w-[40rem] h-[40rem] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob" />
          <div className="absolute top-0 -right-4 w-[35rem] h-[35rem] bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-[45rem] h-[45rem] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-blob animation-delay-6000" />
        </div>

        {/* Floating Particles with Parallax */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`,
          }}
        >
          {/* Main Floating Elements */}
          <div className="absolute top-1/4 left-10 text-8xl opacity-10 rotate-12 animate-float-rotate select-none">
            🚀
          </div>
          <div
            className="absolute top-1/3 right-10 text-7xl opacity-10 -rotate-12 animate-float-rotate select-none"
            style={{ animationDelay: '1s' }}
          >
            ✨
          </div>
          <div
            className="absolute bottom-1/4 left-1/3 text-6xl opacity-10 rotate-6 animate-float-rotate select-none"
            style={{ animationDelay: '2s' }}
          >
            💡
          </div>
          <div
            className="absolute bottom-1/3 right-1/4 text-7xl opacity-10 -rotate-6 animate-float-rotate select-none"
            style={{ animationDelay: '3s' }}
          >
            🎯
          </div>

          {/* Additional Small Particles */}
          <div className="absolute top-1/6 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-particle" />
          <div
            className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-particle"
            style={{ animationDelay: '0.5s' }}
          />
          <div
            className="absolute bottom-1/4 left-1/5 w-2 h-2 bg-pink-400 rounded-full animate-particle"
            style={{ animationDelay: '1s' }}
          />
          <div
            className="absolute top-1/2 right-1/6 w-4 h-4 bg-cyan-400 rounded-full animate-particle"
            style={{ animationDelay: '1.5s' }}
          />
          <div
            className="absolute bottom-1/3 right-1/2 w-3 h-3 bg-yellow-400 rounded-full animate-particle"
            style={{ animationDelay: '2s' }}
          />
        </div>

        {/* Animated Light Rays */}
        <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-10">
          <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-light-ray" />
          <div
            className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-light-ray"
            style={{ animationDelay: '1s' }}
          />
          <div
            className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-light-ray"
            style={{ animationDelay: '2s' }}
          />
        </div>

        <div className="container relative flex flex-col items-center justify-center gap-6 md:gap-8 pb-12 md:pb-16 pt-16 md:pt-20 lg:pt-32 px-4">
          <div className="flex max-w-[980px] flex-col items-center gap-3 md:gap-4 text-center">
            {/* Modern Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-in fade-in-50 slide-in-from-top-5 duration-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {t('hero.findPerfect')} {t('hero.domain')}
              </span>
            </div>
            {/* Modern Typography with Animation */}
            <div className="relative">
              <h1 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-black tracking-tight text-gray-900 dark:text-gray-100 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-150">
                <span className="block">{t('hero.findPerfect')}</span>
                <span className="relative mt-2 block">
                  <span className="relative z-10 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
                    {t('hero.domain')}
                  </span>
                  {/* Animated Underline */}
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 300 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 5.5C73.5 2 135.5 2 208 5.5C280.5 9 342.5 9 415 5.5"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="animate-draw"
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#9333ea" />
                        <stop offset="50%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>
            </div>
            <p className="mt-8 max-w-[700px] text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
              {t('hero.subtitle')}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center animate-in fade-in slide-in-from-bottom-5 duration-700 delay-500">
              {/* Primary CTA with Glow Effect */}
              <div className="relative">
                <Button
                  size="lg"
                  className="relative px-8 py-6 bg-black dark:bg-white text-white dark:text-black rounded-2xl leading-none flex items-center"
                  onClick={scrollToGenerator}
                >
                  <span className="text-lg font-semibold">
                    {t('hero.startButton')}
                  </span>
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              {/* Secondary CTA with Glass Effect */}
              <Button
                variant="ghost"
                size="lg"
                asChild
                className="px-8 py-6 backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl hover:bg-white/50 dark:hover:bg-gray-900/50 transition-all duration-300"
              >
                <Link href={localePath('/settings/favorites')}>
                  <Heart className="mr-3 h-5 w-5" />
                  <span className="text-lg">{t('results.myFavorites')}</span>
                </Link>
              </Button>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full p-1">
                <div className="w-1 h-2 bg-gray-400 dark:bg-gray-600 rounded-full mx-auto animate-scroll" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Generator Section */}
      <section
        id="domain-generator"
        className="relative py-16 md:py-20 lg:py-24 overflow-hidden"
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900" />

        {/* Floating Orbs */}
        <div className="absolute -inset-x-40 -inset-y-40 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000" />
        </div>

        <div
          className="container relative px-4 animate-in fade-in-50 slide-in-from-bottom-10 duration-1000 fill-mode-both"
          style={{ animationDelay: '300ms' }}
        >
          <DomainGenerator />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 md:py-20 lg:py-32 overflow-hidden">
        {/* Animated Mesh Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-[0.03]" />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-cyan-50/30 dark:from-purple-900/10 dark:to-cyan-900/10" />

        <div className="container relative px-4">
          <div className="mx-auto max-w-2xl text-center mb-12 md:mb-16">
            {/* Section Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 mb-4 animate-in fade-in slide-in-from-top-5 duration-500">
              <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                {t('whyChooseUs.badge')}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-5 duration-700">
              {t('whyChooseUs.title')}
            </h2>
            <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
              {t('whyChooseUs.subtitle')}
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* 懂你的想法 */}
            <div
              className="group relative animate-in fade-in-50 slide-in-from-bottom-5 duration-700 fill-mode-both"
              style={{ animationDelay: '200ms' }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200" />
              <Card className="relative h-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="mb-4">
                    <div className="relative inline-flex">
                      <div className="absolute inset-0 bg-violet-600 rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition" />
                      <div className="relative rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 p-3">
                        <Lightbulb className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {t('features.aiAnalysis.title')}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {t('features.aiAnalysis.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('features.aiAnalysis.content')}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 创意无限 */}
            <div
              className="group relative animate-in fade-in-50 slide-in-from-bottom-5 duration-700 fill-mode-both"
              style={{ animationDelay: '300ms' }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200" />
              <Card className="relative h-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="mb-4">
                    <div className="relative inline-flex">
                      <div className="absolute inset-0 bg-blue-600 rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition" />
                      <div className="relative rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 p-3">
                        <Palette className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {t('features.multiStrategy.title')}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {t('features.multiStrategy.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('features.multiStrategy.content')}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 马上知道结果 */}
            <div
              className="group relative animate-in fade-in-50 slide-in-from-bottom-5 duration-700 fill-mode-both"
              style={{ animationDelay: '400ms' }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200" />
              <Card className="relative h-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="mb-4">
                    <div className="relative inline-flex">
                      <div className="absolute inset-0 bg-cyan-600 rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition" />
                      <div className="relative rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 p-3">
                        <Search className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {t('features.realTimeQuery.title')}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {t('features.realTimeQuery.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('features.realTimeQuery.content')}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 收藏好名字 */}
            <div
              className="group relative animate-in fade-in-50 slide-in-from-bottom-5 duration-700 fill-mode-both"
              style={{ animationDelay: '500ms' }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200" />
              <Card className="relative h-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="mb-4">
                    <div className="relative inline-flex">
                      <div className="absolute inset-0 bg-pink-600 rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition" />
                      <div className="relative rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 p-3">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {t('features.smartFavorites.title')}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {t('features.smartFavorites.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('features.smartFavorites.content')}
                  </p>
                  {stats && stats.total_favorites > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {t('features.smartFavorites.statsText', {
                        count: formatNumber(stats.total_favorites),
                      })}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 灵感不会丢 */}
            <div
              className="group relative animate-in fade-in-50 slide-in-from-bottom-5 duration-700 fill-mode-both"
              style={{ animationDelay: '600ms' }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200" />
              <Card className="relative h-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="mb-4">
                    <div className="relative inline-flex">
                      <div className="absolute inset-0 bg-indigo-600 rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition" />
                      <div className="relative rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {t('features.searchHistory.title')}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {t('features.searchHistory.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('features.searchHistory.content')}
                  </p>
                  {stats && stats.today_searches > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {t('features.searchHistory.statsText', {
                        count: formatNumber(stats.today_searches),
                      })}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 放心使用 */}
            <div
              className="group relative animate-in fade-in-50 slide-in-from-bottom-5 duration-700 fill-mode-both"
              style={{ animationDelay: '700ms' }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200" />
              <Card className="relative h-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="mb-4">
                    <div className="relative inline-flex">
                      <div className="absolute inset-0 bg-green-600 rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition" />
                      <div className="relative rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-3">
                        <Lock className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {t('features.secure.title')}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {t('features.secure.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('features.secure.content')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 md:py-20 lg:py-28 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/95 via-blue-500/95 to-cyan-500/95 dark:from-purple-800/95 dark:via-blue-800/95 dark:to-cyan-800/95" />

        {/* Animated Grid */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [perspective:1000px] [transform-style:preserve-3d] animate-tilt opacity-20" />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-2 h-2 bg-purple-400 rounded-full animate-float" />
          <div
            className="absolute top-20 right-20 w-3 h-3 bg-cyan-400 rounded-full animate-float"
            style={{ animationDelay: '1s' }}
          />
          <div
            className="absolute bottom-20 left-1/3 w-2 h-2 bg-pink-400 rounded-full animate-float"
            style={{ animationDelay: '2s' }}
          />
          <div
            className="absolute bottom-10 right-1/4 w-4 h-4 bg-blue-400 rounded-full animate-float"
            style={{ animationDelay: '3s' }}
          />
        </div>

        <div className="container relative px-4">
          <div className="mx-auto max-w-4xl text-center">
            {/* Stats Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-in fade-in slide-in-from-top-5 duration-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs font-medium text-white/90">
                {t('stats.badge')}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 text-white animate-in fade-in slide-in-from-bottom-5 duration-700">
              {t('stats.title')}
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-12 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
              {stats && stats.total_users > 0
                ? t('stats.usersHelped', {
                    count: formatNumber(stats.total_users),
                  })
                : t('stats.usersHelpedDefault')}
            </p>
            {statsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-white/60" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                {/* Domains Generated */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-purple-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300">
                    <div className="text-3xl md:text-4xl font-black mb-2 text-white">
                      {stats
                        ? formatNumber(stats.total_domains_generated)
                        : '0'}
                    </div>
                    <div className="text-sm text-white/70">
                      {t('stats.domainsGenerated')}
                    </div>
                  </div>
                </div>

                {/* Users Trust */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300">
                    <div className="text-3xl md:text-4xl font-black mb-2 text-white">
                      {stats ? formatNumber(stats.total_users) : '0'}
                    </div>
                    <div className="text-sm text-white/70">
                      {t('stats.usersTrust')}
                    </div>
                  </div>
                </div>

                {/* Service Uptime */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-cyan-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300">
                    <div className="text-3xl md:text-4xl font-black mb-2 text-white">
                      {stats ? `${stats.service_uptime}%` : '99.9%'}
                    </div>
                    <div className="text-sm text-white/70">
                      {t('stats.availability')}
                    </div>
                  </div>
                </div>

                {/* Service Availability */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-green-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300">
                    <div className="text-3xl md:text-4xl font-black mb-2 text-white">
                      {stats ? stats.service_availability : '24/7'}
                    </div>
                    <div className="text-sm text-white/70">
                      {t('stats.onlineService')}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-20 lg:py-32 overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" />

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 text-6xl opacity-[0.02] rotate-12 select-none">
            🎯
          </div>
          <div className="absolute bottom-20 right-1/4 text-7xl opacity-[0.02] -rotate-12 select-none">
            ✨
          </div>
        </div>

        <div className="container relative px-4">
          <div className="mx-auto max-w-3xl">
            {/* Glass Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition duration-1000" />
              <div className="relative backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 rounded-3xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50 text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                  {t('cta.title')}
                </h2>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 md:mb-10 leading-relaxed">
                  {t('cta.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {/* Primary CTA */}
                  <div className="relative w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="relative w-full sm:w-auto px-8 py-6 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center"
                      onClick={scrollToGenerator}
                    >
                      <Play className="mr-3 h-5 w-5" />
                      <span className="text-lg font-semibold">
                        {t('cta.startButton')}
                      </span>
                      <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>

                  {/* Secondary CTA */}
                  <Button
                    variant="ghost"
                    size="lg"
                    asChild
                    className="w-full sm:w-auto px-8 py-6 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center"
                  >
                    <Link href={localePath('/settings/history')}>
                      <History className="mr-3 h-5 w-5" />
                      <span className="text-lg">{t('cta.demoButton')}</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
