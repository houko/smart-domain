import {
  generateMetadata as generateSEOMetadata,
  generateViewport,
} from '@/lib/seo'
import { SecurityClient } from './security-client'

export const metadata = generateSEOMetadata({
  title: '安全设置 - Smart Domain Generator',
  description:
    '管理您的Smart Domain Generator账户安全设置，包括登录会话管理、设备管理和安全建议。保护您的账户安全。',
  keywords: [
    '安全设置',
    '账户安全',
    '登录会话',
    '设备管理',
    'Google OAuth',
    '两步验证',
    '账户保护',
    '会话管理',
  ],
  canonical: '/settings/security',
  noIndex: true, // 用户安全设置页面不需要被搜索引擎索引
})

export const viewport = generateViewport()

export default function SecurityPage() {
  return <SecurityClient />
}
