'use client'

import type React from 'react'
import type { ReactNode } from 'react'

interface StatsigUser {
  userID?: string
  email?: string
  [key: string]: unknown
}

interface StatsigProviderProps {
  children: ReactNode
  user?: StatsigUser
}

// 简化版 StatsigProvider - 直接返回children，功能标志通过hooks处理
export function StatsigProvider({ children }: StatsigProviderProps) {
  return <>{children}</>
}

// HOC用于在页面级别提供用户上下文
export function withStatsig<P extends object>(
  Component: React.ComponentType<P>,
  _getUserData?: () => StatsigUser,
) {
  return function StatsigWrappedComponent(props: P) {
    return (
      <StatsigProvider>
        <Component {...props} />
      </StatsigProvider>
    )
  }
}
