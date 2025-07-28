'use client'

import { AuthGuard } from '@/components/auth-guard'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

export function PreferencesClient() {
  const t = useTranslations('preferences')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    domainAlerts: true,
    newsletter: false,
    language: 'zh-CN',
    resultCount: '10',
    autoSave: true,
  })

  useEffect(() => {
    // 这里应该从数据库加载用户偏好设置
    // 暂时使用默认值
  }, [])

  const handleSavePreferences = async () => {
    setLoading(true)
    try {
      // 这里应该保存到数据库
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 模拟API调用

      toast({
        title: t('saveSuccess'),
        description: t('saveSuccessDesc'),
      })
    } catch (_error) {
      toast({
        title: t('saveFailed'),
        description: t('saveFailedDesc'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>

        {/* 通知设置 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('notifications.title')}</CardTitle>
            <CardDescription>{t('notifications.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">
                  {t('notifications.emailNotifications.label')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('notifications.emailNotifications.description')}
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) =>
                  setPreferences({
                    ...preferences,
                    emailNotifications: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="domain-alerts">
                  {t('notifications.domainAlerts.label')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('notifications.domainAlerts.description')}
                </p>
              </div>
              <Switch
                id="domain-alerts"
                checked={preferences.domainAlerts}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, domainAlerts: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="newsletter">
                  {t('notifications.newsletter.label')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('notifications.newsletter.description')}
                </p>
              </div>
              <Switch
                id="newsletter"
                checked={preferences.newsletter}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, newsletter: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* 显示设置 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('display.title')}</CardTitle>
            <CardDescription>{t('display.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">{t('display.language.label')}</Label>
              <Select
                value={preferences.language}
                onValueChange={(value) =>
                  setPreferences({ ...preferences, language: value })
                }
              >
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh-CN">
                    {t('display.language.options.zh-CN')}
                  </SelectItem>
                  <SelectItem value="zh-TW">
                    {t('display.language.options.zh-TW')}
                  </SelectItem>
                  <SelectItem value="en-US">
                    {t('display.language.options.en-US')}
                  </SelectItem>
                  <SelectItem value="ja-JP">
                    {t('display.language.options.ja-JP')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="result-count">
                {t('display.resultCount.label')}
              </Label>
              <Select
                value={preferences.resultCount}
                onValueChange={(value) =>
                  setPreferences({ ...preferences, resultCount: value })
                }
              >
                <SelectTrigger id="result-count">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">
                    {t('display.resultCount.options.5')}
                  </SelectItem>
                  <SelectItem value="10">
                    {t('display.resultCount.options.10')}
                  </SelectItem>
                  <SelectItem value="20">
                    {t('display.resultCount.options.20')}
                  </SelectItem>
                  <SelectItem value="50">
                    {t('display.resultCount.options.50')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 功能设置 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('features.title')}</CardTitle>
            <CardDescription>{t('features.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-save">
                  {t('features.autoSave.label')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('features.autoSave.description')}
                </p>
              </div>
              <Switch
                id="auto-save"
                checked={preferences.autoSave}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, autoSave: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSavePreferences}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('saving')}
            </>
          ) : (
            t('saveButton')
          )}
        </Button>
      </div>
    </AuthGuard>
  )
}
