import './globals.css'

import type { Metadata, Viewport } from 'next'

import { PWARegister } from '@/components/pwa-register'
import {
  OrganizationStructuredData,
  WebsiteStructuredData,
} from '@/components/seo/structured-data'
import { StatsigDebug } from '@/components/statsig-debug'
import { StatsigProvider } from '@/components/statsig-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import { Analytics } from '@vercel/analytics/next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import type { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Smart Domain Generator',
  description: '智能域名生成器 - AI驱动的项目命名和域名建议系统',
  keywords: '域名生成器,项目命名,AI命名,域名查询,域名建议',
  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '16x16 32x32 48x48 64x64',
        type: 'image/x-icon',
      },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  authors: [{ name: 'Smart Domain Team' }],
  creator: 'Smart Domain Generator',
  publisher: 'Smart Domain Generator',
  robots: 'index, follow',
  applicationName: 'Smart Domain Generator',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SmartDomain',
  },
  formatDetection: {
    telephone: false,
  },
  alternates: {
    canonical: 'https://smart-domain.com',
    languages: {
      'zh-CN': 'https://smart-domain.com/zh',
      'en-US': 'https://smart-domain.com/en',
      'ja-JP': 'https://smart-domain.com/ja',
    },
  },
  openGraph: {
    title: 'Smart Domain Generator',
    description: '智能域名生成器 - AI驱动的项目命名和域名建议系统',
    type: 'website',
    siteName: 'Smart Domain Generator',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Smart Domain Generator - 智能域名生成器',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Domain Generator',
    description: '智能域名生成器 - AI驱动的项目命名和域名建议系统',
    images: ['/og-image.png'],
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
        )}
      >
        <WebsiteStructuredData />
        <OrganizationStructuredData />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StatsigProvider>
            {children}
            <Toaster />
            <StatsigDebug />
            <Analytics />
            <PWARegister />
            {/* Custom Analytics */}
            <Script
              defer
              src="https://analytics.xiaomo.info/script.js"
              data-website-id="8ce90b5b-2723-4f4a-b998-cb48b4627111"
              strategy="afterInteractive"
            />
          </StatsigProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
