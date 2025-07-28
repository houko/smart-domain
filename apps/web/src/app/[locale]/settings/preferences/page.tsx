import {
  generateMetadata as generateSEOMetadata,
  generateViewport,
} from '@/lib/seo'
import { PreferencesClient } from './preferences-client'

export const metadata = generateSEOMetadata({
  title: '偏好设置 - Smart Domain Generator',
  description:
    '个性化您的Smart Domain Generator使用体验，设置语言偏好、主题模式和通知设置。',
  keywords: [
    '偏好设置',
    '个性化设置',
    '用户偏好',
    '主题设置',
    '语言设置',
    '通知设置',
    '界面设置',
  ],
  canonical: '/settings/preferences',
  noIndex: true,
})

export const viewport = generateViewport()

export default function PreferencesPage() {
  return <PreferencesClient />
}
