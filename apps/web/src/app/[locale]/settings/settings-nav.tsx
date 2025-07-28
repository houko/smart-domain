'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  ChevronDown,
  CreditCard,
  Heart,
  History,
  Key,
  Menu,
  Settings,
  Shield,
  User,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const getSidebarItems = (t: ReturnType<typeof useTranslations>) => [
  {
    title: t('navigation.account'),
    href: '/settings',
    icon: User,
  },
  {
    title: t('navigation.domainFavorites'),
    href: '/settings/favorites',
    icon: Heart,
  },
  {
    title: t('navigation.searchHistory'),
    href: '/settings/history',
    icon: History,
  },
  {
    title: t('navigation.preferences'),
    href: '/settings/preferences',
    icon: Settings,
  },
  {
    title: t('navigation.security'),
    href: '/settings/security',
    icon: Shield,
  },
  {
    title: t('navigation.apiKeys'),
    href: '/settings/api-keys',
    icon: Key,
  },
  {
    title: t('navigation.subscription'),
    href: '/settings/billing',
    icon: CreditCard,
  },
]

export function SettingsNav() {
  const t = useTranslations('settings')
  const pathname = usePathname()
  const sidebarItems = getSidebarItems(t)

  // 找到当前激活的菜单项
  const activeItem = sidebarItems.find((item) => pathname === item.href)

  return (
    <>
      {/* 移动端下拉菜单 */}
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center">
                {activeItem ? (
                  <>
                    <activeItem.icon className="mr-2 h-4 w-4" />
                    <span>{activeItem.title}</span>
                  </>
                ) : (
                  <>
                    <Menu className="mr-2 h-4 w-4" />
                    <span>设置菜单</span>
                  </>
                )}
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center w-full',
                      isActive && 'bg-secondary',
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 大屏幕侧边栏 */}
      <nav className="hidden lg:flex lg:flex-col lg:space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Button
              key={item.href}
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn('justify-start w-full', isActive && 'bg-secondary')}
              asChild
            >
              <Link href={item.href}>
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </Button>
          )
        })}
      </nav>
    </>
  )
}
