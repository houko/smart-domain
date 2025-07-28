'use client'

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-2xl font-semibold">发生了严重错误</h2>
            <p className="text-gray-600 max-w-sm">
              应用程序遇到了一个无法恢复的错误。请刷新页面重试。
            </p>
            <button
              type="button"
              onClick={reset}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              重新加载
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
