'use client'

import { Github, Heart, Mail, Twitter } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'

export function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()
  const currentYear = new Date().getFullYear()

  // Helper function to generate locale-aware paths
  const localePath = (path: string) => {
    return locale === 'zh' ? path : `/${locale}${path}`
  }

  return (
    <footer className="relative mt-auto">
      {/* Gradient Border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />

      {/* Main Footer Content */}
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 py-8 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-12">
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2 text-center md:text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto md:mx-0">
                {t('description')}
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <Github className="h-5 w-5" />
                </Link>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link
                  href="mailto:contact@smartdomain.com"
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Links Grid - Mobile: 2 columns, Desktop: 2 separate columns */}
            <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-2 gap-6">
              {/* Quick Links */}
              <div className="text-center md:text-left">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {t('quickLinks.title')}
                </h3>
                <ul className="space-y-1.5">
                  <li>
                    <Link
                      href={localePath('/')}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      {t('quickLinks.home')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={localePath('/settings/favorites')}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      {t('quickLinks.favorites')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={localePath('/settings/history')}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      {t('quickLinks.history')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={localePath('/settings')}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      {t('quickLinks.settings')}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div className="text-center md:text-left">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {t('resources.title')}
                </h3>
                <ul className="space-y-1.5">
                  <li>
                    <Link
                      href={localePath('/api-docs')}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      {t('resources.apiDocs')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={localePath('/privacy')}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      {t('resources.privacy')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={localePath('/terms')}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      {t('resources.terms')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={localePath('/help')}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      {t('resources.help')}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 text-center md:text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400 order-2 md:order-1">
                {t('copyright', { year: currentYear })}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1 order-1 md:order-2">
                {t('madeWith')}{' '}
                <Heart className="h-4 w-4 text-red-500 fill-red-500" />{' '}
                {t('by')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
