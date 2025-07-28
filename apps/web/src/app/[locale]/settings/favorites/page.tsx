import {
  generateMetadata as generateSEOMetadata,
  generateViewport,
} from '@/lib/seo'
import { FavoritesClient } from './favorites-client'

export const metadata = generateSEOMetadata({
  title: '域名收藏 - Smart Domain Generator',
  description:
    '管理您收藏的域名列表，添加备注和标签，快速查找和组织您感兴趣的域名。',
  keywords: [
    '域名收藏',
    '收藏夹',
    '域名管理',
    '域名书签',
    '域名收集',
    '域名列表',
    '域名整理',
    '域名笔记',
  ],
  canonical: '/settings/favorites',
  noIndex: true,
})

export const viewport = generateViewport()

export default function FavoritesPage() {
  return <FavoritesClient />
}
