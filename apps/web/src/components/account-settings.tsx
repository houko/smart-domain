'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { Loader2, Upload, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type React from 'react'
import { useEffect, useState } from 'react'

export function AccountSettings() {
  const t = useTranslations('account')
  const { toast } = useToast()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setFullName(user.user_metadata?.full_name || '')
        setAvatarUrl(user.user_metadata?.avatar_url || '')
      }
      setLoading(false)
    }

    getUser()
  }, [supabase])

  const handleUpdateProfile = async () => {
    if (!user) {
      return
    }

    setUpdating(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: avatarUrl,
        },
      })

      if (error) {
        throw error
      }

      toast({
        title: t('toast.updateSuccess'),
        description: t('toast.updateSuccessDesc'),
      })

      // 刷新用户数据
      const {
        data: { user: updatedUser },
      } = await supabase.auth.getUser()
      if (updatedUser) {
        setUser(updatedUser)
      }
    } catch (_error) {
      toast({
        title: t('toast.updateFailed'),
        description: t('toast.updateFailedDesc'),
        variant: 'destructive',
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file || !user) {
      return
    }

    try {
      // 这里应该上传到存储服务，暂时使用 placeholder
      toast({
        title: t('toast.featureComingSoon'),
        description: t('toast.avatarUploadSoon'),
      })
    } catch (_error) {
      toast({
        title: t('toast.uploadFailed'),
        description: t('toast.uploadFailedDesc'),
        variant: 'destructive',
      })
    }
  }

  const handleDeleteAccount = async () => {
    toast({
      title: t('toast.featureComingSoon'),
      description: t('toast.deleteAccountSoon'),
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 个人资料 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            {t('profile.title')}
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            {t('profile.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {/* 头像 */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <Avatar className="h-16 w-16 md:h-20 md:w-20">
              <AvatarImage
                src={avatarUrl}
                alt={fullName || t('profile.avatar.alt')}
              />
              <AvatarFallback>
                <User className="h-8 w-8 md:h-10 md:w-10" />
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    {t('profile.avatar.upload')}
                  </span>
                </Button>
              </Label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {t('profile.avatar.recommendation')}
              </p>
            </div>
          </div>

          {/* 表单 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('profile.email.label')}</Label>
              <Input
                id="email"
                type="email"
                value={user.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                {t('profile.email.readonly')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">{t('profile.fullName.label')}</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('profile.fullName.placeholder')}
              />
            </div>

            <Button
              onClick={handleUpdateProfile}
              disabled={updating}
              className="w-full sm:w-auto"
            >
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('profile.updating')}
                </>
              ) : (
                t('profile.saveButton')
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 账户信息 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('info.title')}</CardTitle>
          <CardDescription>{t('info.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium">{t('info.accountId')}</p>
              <p className="text-xs md:text-sm text-muted-foreground break-all">
                {user.id}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">{t('info.loginMethod')}</p>
              <p className="text-xs md:text-sm text-muted-foreground">
                {user.app_metadata?.provider === 'google'
                  ? t('info.google')
                  : t('info.email')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">{t('info.createdAt')}</p>
              <p className="text-xs md:text-sm text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString('zh-CN')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">{t('info.lastSignIn')}</p>
              <p className="text-xs md:text-sm text-muted-foreground">
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleDateString('zh-CN')
                  : t('info.neverSignedIn')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 危险区域 */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">
            {t('dangerZone.title')}
          </CardTitle>
          <CardDescription>{t('dangerZone.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                {t('dangerZone.deleteAccount')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t('dangerZone.deleteConfirmTitle')}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t('dangerZone.deleteConfirmDescription')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('dangerZone.cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {t('dangerZone.deleteAccount')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
