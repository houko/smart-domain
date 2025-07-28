'use client'

import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type ReactNode, useEffect, useState } from 'react'

interface AuthGuardProps {
  children: ReactNode
  fallback?: string
}

export function AuthGuard({
  children,
  fallback = '/auth/login',
}: AuthGuardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push(fallback)
        return
      } else {
        setAuthenticated(true)
      }

      setLoading(false)
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setAuthenticated(false)
        setLoading(true) // 设置为加载状态，防止子组件渲染
        router.push(fallback)
      } else {
        setAuthenticated(true)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router, fallback])

  if (loading || !authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
