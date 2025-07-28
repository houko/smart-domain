import type { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://smart-domain.com'

// 支持的语言
const locales = ['zh', 'en', 'ja']

// 生成多语言URL
function generateLocalizedUrls(path: string, changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'], priority: number) {
  const currentDate = new Date()
  const urls: MetadataRoute.Sitemap = []

  // 添加默认路径（中文）
  if (path === '/') {
    urls.push({
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency,
      priority,
    })
  } else {
    urls.push({
      url: `${baseUrl}${path}`,
      lastModified: currentDate,
      changeFrequency,
      priority,
    })
  }

  // 为每种语言添加URL
  locales.forEach((locale) => {
    urls.push({
      url: `${baseUrl}/${locale}${path === '/' ? '' : path}`,
      lastModified: currentDate,
      changeFrequency,
      priority: priority * 0.9, // 其他语言版本稍低优先级
    })
  })

  return urls
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = []

  // 首页 - 最高优先级
  routes.push(...generateLocalizedUrls('/', 'daily', 1.0))

  // 功能页面
  routes.push(...generateLocalizedUrls('/api-docs', 'weekly', 0.8))
  routes.push(...generateLocalizedUrls('/help', 'weekly', 0.7))

  // 法律页面
  routes.push(...generateLocalizedUrls('/privacy', 'monthly', 0.6))
  routes.push(...generateLocalizedUrls('/terms', 'monthly', 0.6))

  // 认证页面 - 较低优先级
  routes.push(...generateLocalizedUrls('/auth/login', 'monthly', 0.5))

  return routes
}
