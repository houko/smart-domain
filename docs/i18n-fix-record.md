# i18n 修复方法记录

## 问题描述
1. 加了 i18n 之后页面提示 404
2. "name is not defined" 运行时错误

## 修复步骤

### 1. middleware.ts 配置
确保使用了正确的 createMiddleware 配置：
```typescript
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  locales,
  defaultLocale
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
```

### 2. i18n.ts 核心修复 - 关键！
使用健壮的 getRequestConfig 配置：
```typescript
import { getRequestConfig } from 'next-intl/server'

export const locales = ['zh', 'en'] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = 'zh'

export default getRequestConfig(async ({ locale }) => {
  // 确保 locale 存在且有效
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale
  }
  
  try {
    const messages = await import(`../messages/${locale}.json`)
    return {
      locale,
      messages: messages.default
    }
  } catch (error) {
    // 如果加载失败，使用默认语言
    const defaultMessages = await import(`../messages/${defaultLocale}.json`)
    return {
      locale: defaultLocale,
      messages: defaultMessages.default
    }
  }
})
```

### 3. layout.tsx 修复
确保 getMessages 传递了 locale 参数：
```typescript
const messages = await getMessages({ locale })
```

### 4. 重启开发服务器
完全重启服务器清除缓存：
```bash
pkill -f "turbo dev" && pnpm dev
```

## 验证结果
- ✅ 无编译错误
- ✅ 无运行时错误
- ✅ 页面正常显示
- ✅ i18n 消息加载成功

修复时间: 2025年7月20日 17:00
