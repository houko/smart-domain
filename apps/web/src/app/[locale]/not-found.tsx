'use client'

import { useLocale, useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'
import Link from 'next/link'

export default function LocaleNotFound() {
  const t = useTranslations('notFound')
  const locale = useLocale()

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-4 text-center">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">{t('title')}</h2>
        <p className="text-muted-foreground max-w-sm">{t('description')}</p>
        <Button asChild>
          <Link href={`/${locale}`}>{t('backHome')}</Link>
        </Button>
      </div>
    </div>
  )
}
