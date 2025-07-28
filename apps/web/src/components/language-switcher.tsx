'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Languages } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export function LanguageSwitcher() {
  const t = useTranslations('language')
  const router = useRouter()
  const currentLocale = useLocale()

  const languages = [
    { code: 'zh', name: t('chinese'), englishName: 'Chinese' },
    { code: 'en', name: t('english'), englishName: 'English' },
    { code: 'ja', name: t('japanese'), englishName: 'Japanese' },
  ]

  const handleLanguageChange = (locale: string) => {
    // 获取当前路径
    const pathname = window.location.pathname
    // 移除当前语言前缀
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/'
    // 跳转到新语言路径
    router.push(`/${locale}${pathWithoutLocale}`)
  }

  const currentLanguage = languages.find((lang) => lang.code === currentLocale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 md:gap-2 h-8 md:h-9"
        >
          <Languages className="h-3 w-3 md:h-4 md:w-4" />
          <span className="hidden sm:inline text-xs md:text-sm">
            {currentLanguage?.name || t('fallback')}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`cursor-pointer ${
              currentLocale === language.code ? 'bg-accent' : ''
            }`}
          >
            <span>{language.name}</span>
            <span className="ml-auto text-muted-foreground text-xs">
              {language.englishName}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
