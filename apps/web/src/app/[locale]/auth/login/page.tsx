import {
  generateMetadata as generateSEOMetadata,
  generateViewport,
} from '@/lib/seo'
import { LoginClient } from './login-client'

export const metadata = generateSEOMetadata({
  title: '用户登录 - Smart Domain Generator',
  description:
    '使用Google账号安全登录智能域名生成器，访问您的个人设置、收藏域名和搜索历史。快速、安全、便捷的OAuth登录体验。',
  keywords: [
    '用户登录',
    'Google登录',
    'OAuth认证',
    '安全登录',
    '域名生成器登录',
    '用户中心',
    'Google账号',
    'SSO登录',
  ],
  canonical: '/auth/login',
  noIndex: true, // 登录页面不需要被搜索引擎索引
})

export const viewport = generateViewport()

export default function LoginPage() {
  return (
    <>
      {/* 登录页面不需要结构化数据，因为它不是面向公众的内容页面 */}
      <LoginClient />
    </>
  )
}
