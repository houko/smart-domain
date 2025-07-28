'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { Heart, History, LogOut, Settings, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function UserNav() {
  const t = useTranslations('nav')
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)

      // 调试信息 - 可以在开发时查看控制台
      if (user && process.env.NODE_ENV === 'development') {
        console.log('User metadata:', user.user_metadata)
        console.log('Avatar URL:', user.user_metadata?.avatar_url)
        console.log('Picture URL:', user.user_metadata?.picture)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="h-8 w-8 md:h-9 md:w-9 animate-pulse rounded-full bg-muted" />
    )
  }

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push('/auth/login')}
        className="h-8 md:h-9 text-sm"
      >
        {t('login')}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 md:h-9 md:w-9 rounded-full p-0"
        >
          <Avatar className="h-8 w-8 md:h-9 md:w-9">
            <AvatarImage
              src={
                user.user_metadata?.avatar_url || user.user_metadata?.picture
              }
              alt={user.user_metadata?.full_name || user.email || 'User'}
            />
            <AvatarFallback>
              {user.user_metadata?.full_name ? (
                user.user_metadata.full_name.charAt(0).toUpperCase()
              ) : user.email ? (
                user.email.charAt(0).toUpperCase()
              ) : (
                <User className="h-4 w-4" />
              )}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 sm:w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.user_metadata?.full_name || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/settings/favorites')}>
          <Heart className="mr-2 h-4 w-4" />
          <span>{t('favorites')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/settings/history')}>
          <History className="mr-2 h-4 w-4" />
          <span>{t('history')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>{t('settings')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
