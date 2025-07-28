'use client'

import {
  BookOpen,
  Clock,
  CreditCard,
  FileQuestion,
  MessageCircle,
  Search,
  Zap,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function HelpPage() {
  const t = useTranslations('help')

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
      <div className="container px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('search.placeholder')}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <button
            type="button"
            className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-600 dark:hover:border-purple-600 transition-colors text-left group"
          >
            <Zap className="h-8 w-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-1">
              {t('quickLinks.quickStart.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('quickLinks.quickStart.description')}
            </p>
          </button>

          <button
            type="button"
            className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-600 transition-colors text-left group"
          >
            <BookOpen className="h-8 w-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-1">
              {t('quickLinks.tutorials.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('quickLinks.tutorials.description')}
            </p>
          </button>

          <button
            type="button"
            className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-cyan-600 dark:hover:border-cyan-600 transition-colors text-left group"
          >
            <CreditCard className="h-8 w-8 text-cyan-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-1">
              {t('quickLinks.billing.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('quickLinks.billing.description')}
            </p>
          </button>

          <button
            type="button"
            className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-green-600 dark:hover:border-green-600 transition-colors text-left group"
          >
            <MessageCircle className="h-8 w-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-1">
              {t('quickLinks.support.title')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('quickLinks.support.description')}
            </p>
          </button>
        </div>

        {/* FAQ Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t('faq.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Getting Started */}
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
                <h3 className="font-semibold text-lg">
                  {t('faq.gettingStarted.title')}
                </h3>
              </div>
              <ul className="space-y-3">
                <li>
                  <button
                    type="button"
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-2 w-full text-left"
                  >
                    <FileQuestion className="h-4 w-4" />
                    {t('faq.gettingStarted.questions.0')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-2 w-full text-left"
                  >
                    <FileQuestion className="h-4 w-4" />
                    {t('faq.gettingStarted.questions.1')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-2 w-full text-left"
                  >
                    <FileQuestion className="h-4 w-4" />
                    {t('faq.gettingStarted.questions.2')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-2 w-full text-left"
                  >
                    <FileQuestion className="h-4 w-4" />
                    {t('faq.gettingStarted.questions.3')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold text-lg">
                  {t('faq.features.title')}
                </h3>
              </div>
              <ul className="space-y-3">
                <li>
                  <button
                    type="button"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 w-full text-left"
                  >
                    <FileQuestion className="h-4 w-4" />
                    {t('faq.features.questions.0')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 w-full text-left"
                  >
                    <FileQuestion className="h-4 w-4" />
                    {t('faq.features.questions.1')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 w-full text-left"
                  >
                    <FileQuestion className="h-4 w-4" />
                    {t('faq.features.questions.2')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 w-full text-left"
                  >
                    <FileQuestion className="h-4 w-4" />
                    {t('faq.features.questions.3')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Billing */}
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="h-6 w-6 text-cyan-600" />
                <h3 className="font-semibold text-lg">
                  {t('faq.billing.title')}
                </h3>
              </div>
              <ul className="space-y-3">
                <li>
                  <button
                    type="button"
                    className="text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2 w-full text-left"
                  >
                    <FileQuestion className="h-4 w-4" />
                    {t('faq.billing.questions.0')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2 w-full text-left"
                  >
                    <FileQuestion className="h-4 w-4" />
                    {t('faq.billing.questions.1')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2 w-full text-left"
                  >
                    <FileQuestion className="h-4 w-4" />
                    {t('faq.billing.questions.2')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2 w-full text-left"
                  >
                    <FileQuestion className="h-4 w-4" />
                    {t('faq.billing.questions.3')}
                  </button>
                </li>
              </ul>
            </div>

            {/* API Development */}
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-6 w-6 text-green-600" />
                <h3 className="font-semibold text-lg">{t('faq.api.title')}</h3>
              </div>
              <ul className="space-y-3">
                <li>
                  <button
                    type="button"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-2 w-full text-left"
                  >
                    <FileQuestion className="h-4 w-4" />
                    {t('faq.api.questions.0')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-2 w-full text-left"
                  >
                    <FileQuestion className="h-4 w-4" />
                    {t('faq.api.questions.1')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-2 w-full text-left"
                  >
                    <FileQuestion className="h-4 w-4" />
                    {t('faq.api.questions.2')}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-2 w-full text-left"
                  >
                    <FileQuestion className="h-4 w-4" />
                    {t('faq.api.questions.3')}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {t('popularArticles.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-600 dark:hover:border-purple-600 transition-colors cursor-pointer group">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {t('popularArticles.articles.0.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {t('popularArticles.articles.0.description')}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{t('popularArticles.articles.0.readTime')}</span>
              </div>
            </article>

            <article className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-600 transition-colors cursor-pointer group">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {t('popularArticles.articles.1.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {t('popularArticles.articles.1.description')}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{t('popularArticles.articles.1.readTime')}</span>
              </div>
            </article>

            <article className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-cyan-600 dark:hover:border-cyan-600 transition-colors cursor-pointer group">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                {t('popularArticles.articles.2.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {t('popularArticles.articles.2.description')}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{t('popularArticles.articles.2.readTime')}</span>
              </div>
            </article>
          </div>
        </section>

        {/* Contact Support */}
        <section className="text-center">
          <div className="p-8 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800">
            <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {t('contactSupport.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
              {t('contactSupport.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {t('contactSupport.emailButton')}
              </button>
              <button
                type="button"
                className="px-6 py-3 bg-white dark:bg-gray-800 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              >
                {t('contactSupport.chatButton')}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {t('contactSupport.workingHours')}
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
