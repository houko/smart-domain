import {
  generateMetadata as generateSEOMetadata,
  generateViewport,
} from '@/lib/seo'
import type { ReactNode } from 'react'

export const metadata = generateSEOMetadata({
  title: '服务条款 - 使用协议与规则',
  description:
    '使用Smart Domain Generator前请仔细阅读服务条款。了解服务使用规则、用户责任、知识产权和免责声明等重要条款。',
  keywords: [
    '服务条款',
    '使用条款',
    '用户协议',
    '服务协议',
    '使用规则',
    '法律条款',
    '免责声明',
    '知识产权',
    '用户责任',
    '服务规定',
  ],
  canonical: '/terms',
  type: 'website',
})

export const viewport = generateViewport()

export default function TermsLayout({ children }: { children: ReactNode }) {
  return children
}