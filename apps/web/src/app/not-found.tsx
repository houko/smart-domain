import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'
import Link from 'next/link'

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-4 text-center">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">页面未找到</h2>
        <p className="text-muted-foreground max-w-sm">
          抱歉，您访问的页面不存在。请检查URL或返回首页。
        </p>
        <Button asChild>
          <Link href="/zh">返回首页</Link>
        </Button>
      </div>
    </div>
  )
}
