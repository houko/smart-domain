import {
  generateMetadata as generateSEOMetadata,
  generateViewport,
} from '@/lib/seo'
import type { ReactNode } from 'react'

export const metadata = generateSEOMetadata({
  title: '帮助中心 - 常见问题与使用指南',
  description:
    '查找Smart Domain Generator的使用指南、常见问题解答、最佳实践和技术支持。快速解决您在使用过程中遇到的问题。',
  keywords: [
    '帮助中心',
    '使用指南',
    '常见问题',
    'FAQ',
    '技术支持',
    '用户手册',
    '教程',
    '使用说明',
    '客户服务',
    '问题解答',
  ],
  canonical: '/help',
  type: 'website',
})

export const viewport = generateViewport()

export default function HelpLayout({ children }: { children: ReactNode }) {
  return children
}