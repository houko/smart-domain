import {
  generateMetadata as generateSEOMetadata,
  generateViewport,
} from '@/lib/seo'
import type { ReactNode } from 'react'

export const metadata = generateSEOMetadata({
  title: '隐私政策 - 数据保护与用户权益',
  description:
    '了解Smart Domain Generator如何收集、使用和保护您的个人信息。我们承诺保护您的隐私权，确保数据安全。',
  keywords: [
    '隐私政策',
    '隐私保护',
    '数据安全',
    '个人信息',
    '用户隐私',
    'GDPR',
    '数据保护',
    '隐私权',
    '信息安全',
    '用户数据',
  ],
  canonical: '/privacy',
  type: 'website',
})

export const viewport = generateViewport()

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return children
}