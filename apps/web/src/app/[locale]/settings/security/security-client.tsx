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
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import {
  Chrome,
  Clock,
  ExternalLink,
  Globe,
  History,
  Loader2,
  LogOut,
  MapPin,
  Monitor,
  Shield,
  Smartphone,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface LoginSession {
  id: string
  device: string
  browser: string
  location: string
  ip: string
  lastActive: string
  isCurrent: boolean
}

export function SecurityClient() {
  const t = useTranslations('security')
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [sessionsLoading, setSessionsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [sessions, setSessions] = useState<LoginSession[]>([])
  const supabase = createClient()

  useEffect(() => {
    loadUserData()
    loadSessions()
  }, [])

  const loadUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)
  }

  const loadSessions = async () => {
    setSessionsLoading(true)
    try {
      // 获取当前会话
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setSessions([])
        return
      }

      // 获取设备和浏览器信息
      const userAgent = navigator.userAgent
      const deviceInfo = getDeviceInfo(userAgent)
      const browserInfo = getBrowserInfo(userAgent)

      // 获取IP和位置信息
      let ipInfo = null
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒超时

        const ipResponse = await fetch('https://ipapi.co/json/', {
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (ipResponse.ok) {
          ipInfo = await ipResponse.json()
        }
      } catch (error) {
        console.warn(t('sessions.ipInfo'), error)
      }

      // 构建当前会话信息
      const currentSession: LoginSession = {
        id: session.access_token.substring(0, 8), // 使用token的前8位作为ID
        device: deviceInfo,
        browser: browserInfo,
        location: ipInfo
          ? `${ipInfo.country_name || t('sessions.unknown.location')} ${ipInfo.city || ''}`.trim()
          : t('sessions.unknown.location'),
        ip: ipInfo?.ip || t('sessions.unknown.ip'),
        lastActive: t('sessions.currentActive'),
        isCurrent: true,
      }

      setSessions([currentSession])
    } catch (error) {
      console.error(t('sessions.loadFailed'), error)
      setSessions([])
    } finally {
      setSessionsLoading(false)
    }
  }

  // 解析设备信息
  const getDeviceInfo = (userAgent: string): string => {
    if (/iPhone/i.test(userAgent)) {
      const match = userAgent.match(/iPhone OS ([\d_]+)/)
      const version = match ? match[1].replace(/_/g, '.') : ''
      return `iPhone ${version ? `(iOS ${version})` : ''}`
    }
    if (/iPad/i.test(userAgent)) {
      return 'iPad'
    }
    if (/Android/i.test(userAgent)) {
      const match = userAgent.match(/Android ([\d.]+)/)
      const version = match ? match[1] : ''
      return `Android ${version ? `${version}` : t('sessions.device')}`
    }
    if (/Macintosh/i.test(userAgent)) {
      const match = userAgent.match(/Mac OS X ([\d_]+)/)
      const version = match ? match[1].replace(/_/g, '.') : ''
      return `Mac ${version ? `(macOS ${version})` : ''}`
    }
    if (/Windows/i.test(userAgent)) {
      if (/Windows NT 10/i.test(userAgent)) {
        return 'Windows 10/11'
      }
      if (/Windows NT 6.3/i.test(userAgent)) {
        return 'Windows 8.1'
      }
      if (/Windows NT 6.2/i.test(userAgent)) {
        return 'Windows 8'
      }
      if (/Windows NT 6.1/i.test(userAgent)) {
        return 'Windows 7'
      }
      return 'Windows'
    }
    if (/Linux/i.test(userAgent)) {
      return 'Linux'
    }
    return t('sessions.unknown.device')
  }

  // 解析浏览器信息
  const getBrowserInfo = (userAgent: string): string => {
    if (/Firefox/i.test(userAgent)) {
      const match = userAgent.match(/Firefox\/([\d.]+)/)
      const version = match ? match[1] : ''
      return `Firefox ${version}`
    }
    if (/Chrome/i.test(userAgent) && !/Chromium/i.test(userAgent)) {
      const match = userAgent.match(/Chrome\/([\d.]+)/)
      const version = match ? match[1] : ''
      return `Chrome ${version}`
    }
    if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
      const match = userAgent.match(/Version\/([\d.]+).*Safari/)
      const version = match ? match[1] : ''
      return `Safari ${version}`
    }
    if (/Edge/i.test(userAgent)) {
      const match = userAgent.match(/Edge?\/([\d.]+)/)
      const version = match ? match[1] : ''
      return `Edge ${version}`
    }
    if (/Opera/i.test(userAgent)) {
      const match = userAgent.match(/Opera\/([\d.]+)/)
      const version = match ? match[1] : ''
      return `Opera ${version}`
    }
    return t('sessions.unknown.browser')
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      router.push('/auth/login')
      toast({
        title: t('actions.signOutSuccess'),
        description: t('actions.signOutSuccessDesc'),
      })
    } catch (error) {
      toast({
        title: t('actions.signOutFailed'),
        description: t('actions.signOutFailedDesc'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeSession = async (_sessionId: string) => {
    // 由于我们只有当前会话，撤销会话就是退出登录
    await handleSignOut()
  }

  const getDeviceIcon = (device: string) => {
    if (device.includes('iPhone') || device.includes('Android')) {
      return <Smartphone className="h-4 w-4" />
    }
    return <Monitor className="h-4 w-4" />
  }

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>

        {/* 账户信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t('account.title')}
            </CardTitle>
            <CardDescription>{t('account.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {t('account.loginMethod')}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 w-fit"
                  >
                    <Chrome className="h-3 w-3" />
                    {t('account.googleAccount')}
                  </Badge>
                  <span className="text-xs sm:text-sm text-muted-foreground break-all">
                    {user?.email}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open('https://myaccount.google.com/security', '_blank')
                }
                className="w-full sm:w-auto"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">
                  {t('account.googleSecurity')}
                </span>
                <span className="sm:hidden">{t('account.googleSecurity')}</span>
              </Button>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                {t('account.protectedBy')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('account.manageGoogle')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 活跃会话 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              {t('sessions.title')}
            </CardTitle>
            <CardDescription>{t('sessions.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">
                  {t('sessions.loading')}
                </span>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t('sessions.noSessions')}
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="border-b pb-4 last:border-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {getDeviceIcon(session.device)}
                          <span className="font-medium text-sm sm:text-base">
                            {session.device}
                          </span>
                          {session.isCurrent && (
                            <Badge variant="default" className="text-xs">
                              {t('sessions.currentDevice')}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {session.browser}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {session.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.lastActive}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          IP: {session.ip}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                        title={t('sessions.signOutTitle')}
                        className="self-end sm:self-start"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 账户操作 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              {t('actions.title')}
            </CardTitle>
            <CardDescription>{t('actions.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                {t('actions.signOutAllTitle')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('actions.signOutAllDesc')}
              </p>
              <Button
                variant="destructive"
                onClick={handleSignOut}
                disabled={loading}
              >
                {t('actions.signOutButton')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 安全建议 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('recommendations.title')}</CardTitle>
            <CardDescription>{t('recommendations.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• {t('recommendations.tips.twoFactor')}</li>
              <li>• {t('recommendations.tips.checkSessions')}</li>
              <li>• {t('recommendations.tips.signOutPublic')}</li>
              <li>• {t('recommendations.tips.noPublicDevices')}</li>
              <li>• {t('recommendations.tips.checkActivity')}</li>
              <li>• {t('recommendations.tips.changePassword')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
