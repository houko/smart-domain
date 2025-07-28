import {
  LOCALES,
  PAGE_TYPES,
  ROBOTS_CONFIG,
  SCHEMA_ORG,
  SEO_CONFIG,
  SEO_KEYWORDS,
  SITE_INFO,
} from '@/constants'
import type { Metadata, Viewport } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || SITE_INFO.DEFAULT_URL
const siteName = SITE_INFO.NAME
const defaultDescription = SITE_INFO.DEFAULT_DESCRIPTION

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  images?: string[]
  noIndex?: boolean
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  section?: string
  tags?: string[]
}

export function generateMetadata({
  title,
  description = defaultDescription,
  keywords = [],
  canonical,
  images = [],
  noIndex = false,
  type = PAGE_TYPES.WEBSITE,
  publishedTime,
  modifiedTime,
  authors = [...SITE_INFO.AUTHORS],
  section,
  tags = [],
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteName}` : siteName
  const url = canonical ? `${baseUrl}${canonical}` : baseUrl

  // 默认关键词
  const defaultKeywords = SEO_KEYWORDS

  const allKeywords = [...defaultKeywords, ...keywords].join(', ')

  // 默认图片
  const defaultImages = [`${baseUrl}/favicon.svg`]
  const allImages = images.length > 0 ? images : defaultImages

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: authors.map((name) => ({ name })),
    creator: siteName,
    publisher: siteName,
    robots: noIndex
      ? ROBOTS_CONFIG.NOINDEX_NOFOLLOW
      : ROBOTS_CONFIG.INDEX_FOLLOW,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      type,
      locale: LOCALES.ZH_CN,
      images: allImages.map((image) => ({
        url: image.startsWith('http') ? image : `${baseUrl}${image}`,
        width: SEO_CONFIG.OG_IMAGE_WIDTH,
        height: SEO_CONFIG.OG_IMAGE_HEIGHT,
        alt: fullTitle,
      })),
    },
    twitter: {
      card: SEO_CONFIG.TWITTER_CARD_TYPE,
      title: fullTitle,
      description,
      images: allImages,
      creator: SEO_CONFIG.TWITTER_CREATOR,
    },
    manifest: SEO_CONFIG.MANIFEST_PATH,
    icons: {
      icon: [
        {
          url: SEO_CONFIG.FAVICON_ICO,
          sizes: SEO_CONFIG.FAVICON_SIZES,
          type: SEO_CONFIG.FAVICON_TYPE,
        },
        { url: SEO_CONFIG.FAVICON_SVG, type: SEO_CONFIG.FAVICON_SVG_TYPE },
      ],
      shortcut: SEO_CONFIG.FAVICON_ICO,
      apple: SEO_CONFIG.FAVICON_ICO,
    },
  }

  // 添加文章特定的metadata
  if (type === PAGE_TYPES.ARTICLE && (publishedTime || modifiedTime)) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: PAGE_TYPES.ARTICLE,
      publishedTime,
      modifiedTime,
      authors: authors,
      section,
      tags,
    }
  }

  return metadata
}

// 生成 viewport 配置
export function generateViewport(): Viewport {
  return {
    width: SEO_CONFIG.VIEWPORT_WIDTH,
    initialScale: SEO_CONFIG.INITIAL_SCALE,
    themeColor: SEO_CONFIG.THEME_COLOR,
  }
}

// 生成页面描述的工具函数
export function generateDescription(
  content: string,
  maxLength: number = SEO_CONFIG.DESCRIPTION_MAX_LENGTH,
): string {
  if (content.length <= maxLength) {
    return content
  }

  const truncated = content.substring(
    0,
    maxLength - SEO_CONFIG.DESCRIPTION_TRUNCATE_OFFSET,
  )
  const lastSpaceIndex = truncated.lastIndexOf(' ')

  if (lastSpaceIndex > maxLength * SEO_CONFIG.WORD_BREAK_THRESHOLD) {
    return (
      truncated.substring(0, lastSpaceIndex) +
      SEO_CONFIG.DESCRIPTION_TRUNCATE_SUFFIX
    )
  }

  return truncated + SEO_CONFIG.DESCRIPTION_TRUNCATE_SUFFIX
}

// 生成关键词的工具函数
export function generateKeywords(
  base: string[],
  additional: string[] = [],
): string[] {
  const combined = [...base, ...additional]
  // 去重并过滤空值
  return Array.from(new Set(combined.filter(Boolean)))
}

// 生成面包屑导航数据
export function generateBreadcrumbs(
  items: Array<{ name: string; url?: string }>,
) {
  return {
    '@context': SCHEMA_ORG.CONTEXT,
    '@type': SCHEMA_ORG.BREADCRUMB_TYPE,
    itemListElement: items.map((item, index) => ({
      '@type': SCHEMA_ORG.LIST_ITEM_TYPE,
      position: index + 1,
      name: item.name,
      ...(item.url && { item: `${baseUrl}${item.url}` }),
    })),
  }
}

// 生成产品/服务结构化数据
export function generateProductSchema(product: {
  name: string
  description: string
  price?: string
  currency?: string
  availability?: string
  rating?: {
    value: number
    count: number
  }
  features?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: siteName,
    },
    ...(product.price && {
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency || 'CNY',
        availability: `https://schema.org/${product.availability || 'InStock'}`,
      },
    }),
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.value,
        ratingCount: product.rating.count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(product.features && {
      additionalProperty: product.features.map((feature) => ({
        '@type': 'PropertyValue',
        name: 'Feature',
        value: feature,
      })),
    }),
  }
}

// URL规范化
export function canonicalUrl(path = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

// 生成hreflang标签
export function generateHreflang(alternateUrls: Record<string, string> = {}) {
  const hreflang: Record<string, string> = {
    'zh-CN': canonicalUrl(),
    'en-US': canonicalUrl('/en'),
    'ja-JP': canonicalUrl('/ja'),
    ...alternateUrls,
  }

  return Object.entries(hreflang).map(([lang, url]) => ({
    hrefLang: lang,
    href: url,
  }))
}
