const withNextIntl = require('next-intl/plugin')(
  // 这是默认配置文件的路径
  './src/i18n.ts',
)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    '@smart-domain/types',
    '@smart-domain/db',
    '@smart-domain/ai',
  ],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
  },

  // 开发优化：避免构建后需要重启
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },

  // Webpack 配置优化
  webpack: (config, { dev }) => {
    if (dev) {
      // 改善文件监视性能
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      }
      // 禁用某些可能导致问题的优化
      config.cache = false
    }
    return config
  },
  images: {
    domains: ['localhost'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)
