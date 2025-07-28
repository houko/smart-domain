/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://smart-domain.com',
  generateRobotsTxt: false, // 我们已经手动创建了robots.txt
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateIndexSitemap: false,
  exclude: [
    '/server-sitemap.xml',
    '/auth/*',
    '/settings/*',
    '/api/*',
    '/test-auth',
  ],
  alternateRefs: [
    {
      href: 'https://smart-domain.com/zh',
      hreflang: 'zh-CN',
    },
    {
      href: 'https://smart-domain.com/en',
      hreflang: 'en',
    },
    {
      href: 'https://smart-domain.com',
      hreflang: 'x-default',
    },
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/settings/', '/api/', '/auth/'],
      },
    ],
  },
}
