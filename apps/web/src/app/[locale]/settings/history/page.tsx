import {
  generateMetadata as generateSEOMetadata,
  generateViewport,
} from '@/lib/seo'
import { HistoryClient } from './history-client'

export const metadata = generateSEOMetadata({
  title: '搜索历史 - Smart Domain Generator',
  description:
    '查看和管理您的域名搜索历史记录，快速重新执行之前的搜索，追踪域名生成进度和结果。',
  keywords: [
    '搜索历史',
    '域名搜索记录',
    '历史查询',
    '搜索回顾',
    '域名查询历史',
    '搜索管理',
    '查询记录',
    '搜索结果',
  ],
  canonical: '/settings/history',
  noIndex: true,
})

export const viewport = generateViewport()

export default function HistoryPage() {
  return <HistoryClient />
}
