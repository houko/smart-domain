import {
  generateMetadata as generateSEOMetadata,
  generateViewport,
} from '@/lib/seo'
import type { ReactNode } from 'react'

export const metadata = generateSEOMetadata({
  title: 'API文档 - 开发者指南',
  description:
    '完整的Smart Domain Generator API文档，包含域名生成、查询、历史记录等接口说明。支持RESTful API和多种编程语言SDK。',
  keywords: [
    'API文档',
    '开发者文档',
    'RESTful API',
    '域名API',
    '域名查询接口',
    'API密钥',
    '开发者指南',
    'SDK',
    '接口文档',
    'API集成',
  ],
  canonical: '/api-docs',
  type: 'website',
})

export const viewport = generateViewport()

export default function ApiDocsLayout({ children }: { children: ReactNode }) {
  return children
}