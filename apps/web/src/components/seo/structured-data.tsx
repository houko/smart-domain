'use client'

interface WebsiteStructuredDataProps {
  url?: string
  name?: string
  description?: string
}

interface WebApplicationStructuredDataProps {
  url?: string
  name?: string
  description?: string
  applicationCategory?: string
  operatingSystem?: string
}

interface OrganizationStructuredDataProps {
  name?: string
  url?: string
  logo?: string
  description?: string
}

// 网站结构化数据
export function WebsiteStructuredData({
  url = 'https://smart-domain.com',
  name = 'Smart Domain Generator',
  description = '智能域名生成器 - AI驱动的项目命名和域名建议系统',
}: WebsiteStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': url,
    url: url,
    name: name,
    description: description,
    inLanguage: 'zh-CN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/?query={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Smart Domain Team',
      url: url,
    },
  }

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Web应用程序结构化数据
export function WebApplicationStructuredData({
  url = 'https://smart-domain.com',
  name = 'Smart Domain Generator',
  description = '智能域名生成器 - AI驱动的项目命名和域名建议系统',
  applicationCategory = 'BusinessApplication',
  operatingSystem = 'Web Browser',
}: WebApplicationStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${url}#webapp`,
    url: url,
    name: name,
    description: description,
    applicationCategory: applicationCategory,
    operatingSystem: operatingSystem,
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0.0',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
      category: 'Free',
    },
    creator: {
      '@type': 'Organization',
      name: 'Smart Domain Team',
      url: url,
    },
    featureList: [
      'AI驱动的域名生成',
      '智能项目命名建议',
      '域名可用性检查',
      '批量域名查询',
      'API接口访问',
    ],
  }

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// 组织结构化数据
export function OrganizationStructuredData({
  name = 'Smart Domain Team',
  url = 'https://smart-domain.com',
  logo = 'https://smart-domain.com/favicon.svg',
  description = '专注于AI驱动的域名生成和项目命名解决方案',
}: OrganizationStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}#organization`,
    name: name,
    url: url,
    logo: {
      '@type': 'ImageObject',
      url: logo,
    },
    description: description,
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['Chinese', 'English'],
    },
    sameAs: [],
  }

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// 软件应用结构化数据
export function SoftwareApplicationStructuredData() {
  const url = 'https://smart-domain.com'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${url}#software`,
    name: 'Smart Domain Generator',
    description: '智能域名生成器 - AI驱动的项目命名和域名建议系统',
    url: url,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    softwareVersion: '1.0.0',
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    author: {
      '@type': 'Organization',
      name: 'Smart Domain Team',
    },
    offers: [
      {
        '@type': 'Offer',
        name: '免费版',
        price: '0',
        priceCurrency: 'CNY',
        description: '每月50次域名查询，基础AI建议',
      },
      {
        '@type': 'Offer',
        name: '专业版',
        price: '99',
        priceCurrency: 'CNY',
        description: '每月1000次域名查询，高级AI分析，API访问',
      },
      {
        '@type': 'Offer',
        name: '企业版',
        price: '399',
        priceCurrency: 'CNY',
        description: '无限域名查询，企业级AI建议，24/7支持',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
    screenshot: `${url}/screenshots/main-interface.png`,
    featureList: [
      'AI智能域名生成',
      '实时域名可用性检查',
      '批量域名查询',
      '项目命名建议',
      'RESTful API接口',
      '搜索历史管理',
      '域名收藏功能',
    ],
  }

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// FAQ结构化数据
export function FAQStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '智能域名生成器是如何工作的？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '我们的AI系统分析您的项目描述，结合行业关键词、语言学规则和市场趋势，生成创意且可用的域名建议。',
        },
      },
      {
        '@type': 'Question',
        name: 'API接口支持哪些功能？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'API支持域名生成、可用性检查、批量查询、搜索历史管理等功能，适合开发者集成到自己的应用中。',
        },
      },
      {
        '@type': 'Question',
        name: '免费版有什么限制？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '免费版每月提供50次域名查询，包含基础AI建议和7天搜索历史，足够个人项目使用。',
        },
      },
      {
        '@type': 'Question',
        name: '域名建议的准确性如何？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '我们的AI模型经过大量训练，结合实时域名数据库，提供高质量的域名建议，成功率超过85%。',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
