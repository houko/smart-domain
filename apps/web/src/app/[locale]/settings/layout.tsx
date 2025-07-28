import type { ReactNode } from 'react'
import { SettingsNav } from './settings-nav'

export default function SettingsLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="container py-4 md:py-6 lg:py-8 px-3 sm:px-4">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col space-y-4 sm:space-y-6 md:space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          {/* 侧边栏 */}
          <aside className="lg:w-1/5">
            <SettingsNav />
          </aside>

          {/* 主内容 */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  )
}
