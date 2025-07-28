import {
  generateMetadata as generateSEOMetadata,
  generateViewport,
} from '@/lib/seo'
import type { ReactNode } from 'react'

export const metadata = generateSEOMetadata({
  title: '登录 - 访问您的账户',
  description:
    '登录Smart Domain Generator账户，管理您的域名查询历史、收藏夹和API密钥。支持GitHub和Google快速登录。',
  keywords: [
    '登录',
    '用户登录',
    '账户登录',
    'GitHub登录',
    'Google登录',
    '账户访问',
    '身份验证',
    '安全登录',
    'OAuth登录',
    '单点登录',
  ],
  canonical: '/auth/login',
  type: 'website',
  noIndex: true, // 登录页面不需要被搜索引擎索引
})

export const viewport = generateViewport()

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children
}