'use client'

import { Check, Code2, Copy, Globe2, Shield, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

// 代码高亮组件
function CodeBlock({
  children,
  language = 'bash',
  showCopy = true,
}: {
  children: string
  language?: string
  showCopy?: boolean
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="relative">
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}
        showLineNumbers={false}
        wrapLines={true}
        wrapLongLines={true}
      >
        {children}
      </SyntaxHighlighter>
      {showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 hover:bg-gray-700 rounded-lg transition-colors"
          title="复制代码"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 text-gray-400" />
          )}
        </button>
      )}
    </div>
  )
}

export default function ApiDocsPage() {
  const t = useTranslations('apiDocs')

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
      <div className="container px-4 py-12 max-w-5xl">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {t('title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-12 text-lg">
          {t('subtitle')}
        </p>

        {/* API Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <Zap className="h-10 w-10 text-purple-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              {t('features.performance.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('features.performance.description')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <Shield className="h-10 w-10 text-blue-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              {t('features.security.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('features.security.description')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <Code2 className="h-10 w-10 text-cyan-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              {t('features.easyToUse.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('features.easyToUse.description')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <Globe2 className="h-10 w-10 text-green-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              {t('features.global.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('features.global.description')}
            </p>
          </div>
        </div>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t('quickStart.title')}</h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3">
                {t('quickStart.step1.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('quickStart.step1.description')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3">
                {t('quickStart.step2.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('quickStart.step2.description')}
              </p>
              <CodeBlock language="bash">
                {`curl -X POST https://api.smartdomain.com/v1/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "description": "A social app for pet owners",
    "count": 10
  }'`}
              </CodeBlock>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3">
                {t('quickStart.step3.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('quickStart.step3.description')}
              </p>
              <CodeBlock language="json">
                {`{
  "status": "success",
  "data": {
    "suggestions": [
      {
        "name": "PetPalace",
        "domains": [
          {
            "domain": "petpalace.com",
            "available": false,
            "price": "$12.99"
          },
          {
            "domain": "petpalace.io",
            "available": true,
            "price": "$39.99"
          }
        ]
      }
    ]
  }
}`}
              </CodeBlock>
            </div>
          </div>
        </section>

        {/* API Endpoints */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t('endpoints.title')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4">Method</th>
                  <th className="text-left py-3 px-4">Endpoint</th>
                  <th className="text-left py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      POST
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-sm">/v1/generate</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {t('endpoints.generate')}
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      GET
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-sm">/v1/history</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {t('endpoints.history')}
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      GET
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-sm">/v1/favorites</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {t('endpoints.favorites')}
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      POST
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-sm">/v1/favorites</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {t('endpoints.addFavorite')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
