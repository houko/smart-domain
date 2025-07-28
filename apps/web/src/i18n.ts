import { DEFAULT_LOCALE, LOCALES } from '@/constants'
import { getRequestConfig } from 'next-intl/server'

// 支持的语言列表
export const locales = [LOCALES.ZH, LOCALES.EN, LOCALES.JA] as const
export type Locale = (typeof locales)[number]

// 默认语言
export const defaultLocale: Locale = DEFAULT_LOCALE

export default getRequestConfig(async ({ locale }) => {
  // 确保 locale 存在且有效
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale
  }

  try {
    const messages = await import(`../messages/${locale}.json`)
    return {
      locale,
      messages: messages.default,
    }
  } catch (error) {
    // 如果加载失败，使用默认语言
    const defaultMessages = await import(`../messages/${defaultLocale}.json`)
    return {
      locale: defaultLocale,
      messages: defaultMessages.default,
    }
  }
})
