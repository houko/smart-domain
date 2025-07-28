import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  generateMetadata as generateSEOMetadata,
  generateViewport,
} from '@/lib/seo'
import Link from 'next/link'

export const metadata = generateSEOMetadata({
  title: '认证错误 - Smart Domain Generator',
  description: '登录认证过程中发生错误，请重新尝试登录或返回首页。',
  keywords: ['认证错误', '登录错误', '认证失败', '登录问题', '错误页面'],
  canonical: '/auth/auth-code-error',
  noIndex: true,
})

export const viewport = generateViewport()

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">认证失败</CardTitle>
          <CardDescription>登录过程中出现了问题</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            很抱歉，我们无法完成您的登录请求。这可能是由于：
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>登录链接已过期</li>
            <li>您的浏览器阻止了必要的 cookies</li>
            <li>网络连接问题</li>
          </ul>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/auth/login">重新登录</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">返回首页</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
