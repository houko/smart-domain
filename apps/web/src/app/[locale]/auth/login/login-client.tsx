'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Logo } from '@/components/logo'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export function LoginClient() {
  const t = useTranslations('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  // 清理URL参数中的错误信息，避免显示不必要的错误提示
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const hasErrorParams =
        url.searchParams.has('error') ||
        url.searchParams.has('error_description') ||
        url.pathname.includes('error')

      // 如果URL包含错误参数，清理URL但不显示错误
      if (hasErrorParams) {
        const cleanUrl = `${url.origin}${url.pathname}`
        window.history.replaceState({}, '', cleanUrl)
      }

      // 清理任何可能遗留的错误状态
      setError(null)
    }
  }, [])

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError(null)

      const redirectUrl =
        location.hostname === 'localhost'
          ? `${location.origin}/auth/callback`
          : process.env.NEXT_PUBLIC_APP_URL
            ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
            : `${location.origin}/auth/callback`

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        setError(error.message)
      }
    } catch (_err) {
      setError(t('loginFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* 与主页一致的背景效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-cyan-50 dark:from-purple-950/20 dark:via-transparent dark:to-cyan-950/20" />

      {/* 网格背景 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* 装饰性元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob" />
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000" />
      </div>

      {/* 左上角Logo */}
      <div className="absolute top-0 left-0 z-20 p-6">
        <Link href="/">
          <Logo showText={true} className="h-8" />
        </Link>
      </div>

      {/* 主内容 */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo和标题 */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <Logo showText={false} className="h-16 w-16" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
              Smart Domain
            </h1>
            <p className="text-gray-600 dark:text-gray-400">智能域名生成器</p>
          </div>

          {/* 登录卡片 */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-center">
                {t('title')}
              </CardTitle>
              <CardDescription className="text-center">
                {t('subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <Button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full h-11 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('signingIn')}
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    {t('googleLogin')}
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                {t('agreement')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
