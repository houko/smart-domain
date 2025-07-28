'use client'

import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // Check if we're on an auth page
  const isAuthPage = pathname.includes('/auth/')

  if (isAuthPage) {
    // Auth pages: no navbar or footer
    return <>{children}</>
  }

  // Other pages: show navbar and footer
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
