import { AccountSettings } from '@/components/account-settings'
import { AuthGuard } from '@/components/auth-guard'
import {
  generateMetadata as generateSEOMetadata,
  generateViewport,
} from '@/lib/seo'

export const metadata = generateSEOMetadata({
  title: '账户设置 - Smart Domain Generator',
  description:
    '管理您的Smart Domain Generator账户设置，包括个人信息、通知偏好和账户安全设置。',
  keywords: [
    '账户设置',
    '用户设置',
    '个人资料',
    '账户管理',
    '用户中心',
    '设置面板',
  ],
  canonical: '/settings',
  noIndex: true, // 用户设置页面不需要被搜索引擎索引
})

export const viewport = generateViewport()

export default function SettingsPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">账户设置</h1>
      <AuthGuard>
        <AccountSettings />
      </AuthGuard>
    </div>
  )
}
