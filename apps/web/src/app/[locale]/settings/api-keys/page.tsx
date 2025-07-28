import { ApiKeyManager } from '@/components/api-key-manager'
import { AuthGuard } from '@/components/auth-guard'
import {
  generateMetadata as generateSEOMetadata,
  generateViewport,
} from '@/lib/seo'

export const metadata = generateSEOMetadata({
  title: 'API密钥管理 - Smart Domain Generator',
  description:
    '管理您的Smart Domain Generator API访问密钥，创建、删除和监控API密钥使用情况。安全地集成我们的域名生成服务。',
  keywords: [
    'API密钥',
    'API管理',
    'API访问',
    '开发者工具',
    'API集成',
    '域名API',
    'RESTful API',
    'API安全',
  ],
  canonical: '/settings/api-keys',
  noIndex: true, // API密钥管理页面不需要被搜索引擎索引
})

export const viewport = generateViewport()

export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API 密钥</h1>
        <p className="text-muted-foreground">管理您的 API 访问密钥</p>
      </div>
      <AuthGuard>
        <ApiKeyManager />
      </AuthGuard>
    </div>
  )
}
