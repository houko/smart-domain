import { DEFAULT_LOCALE, LOCALES } from '@/constants'
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: [LOCALES.ZH, LOCALES.EN, LOCALES.JA],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
  localeDetection: true, // 自动检测用户的语言偏好
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
