import {
  generateMetadata as generateSEOMetadata,
  generateViewport,
} from '@/lib/seo'
import { BillingClient } from './billing-client'

export const metadata = generateSEOMetadata({
  title: '订阅管理 - Smart Domain Generator',
  description:
    '管理您的Smart Domain Generator订阅计划，查看使用情况和计费详情。升级到专业版获得更多功能。',
  keywords: [
    '订阅管理',
    '计费设置',
    '付费计划',
    '专业版',
    '使用统计',
    '账单管理',
    '套餐升级',
  ],
  canonical: '/settings/billing',
  noIndex: true,
})

export const viewport = generateViewport()

export default function BillingPage() {
  return <BillingClient />
}
