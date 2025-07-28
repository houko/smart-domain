'use client'

import {
  CheckCircle,
  Database,
  Eye,
  FileText,
  Lock,
  Mail,
  Shield,
  UserCheck,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function PrivacyPage() {
  const t = useTranslations('privacy')

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
      <div className="container px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {t('title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t('lastUpdated', { date: t('date') })}
        </p>

        {/* Privacy Principles */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-600" />
            {t('principles.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <Lock className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-semibold mb-1">
                {t('principles.dataMinimization.title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('principles.dataMinimization.description')}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <Eye className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold mb-1">
                {t('principles.transparency.title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('principles.transparency.description')}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
              <Database className="h-8 w-8 text-cyan-600 mb-2" />
              <h3 className="font-semibold mb-1">
                {t('principles.security.title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('principles.security.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Data Collection */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {t('dataCollection.title')}
          </h2>

          <div className="space-y-6">
            {/* Account Information */}
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-purple-600" />
                {t('dataCollection.account.title')}
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{t('dataCollection.account.items.0')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{t('dataCollection.account.items.1')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{t('dataCollection.account.items.2')}</span>
                </li>
              </ul>
            </div>

            {/* Usage Data */}
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                {t('dataCollection.usage.title')}
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{t('dataCollection.usage.items.0')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{t('dataCollection.usage.items.1')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{t('dataCollection.usage.items.2')}</span>
                </li>
              </ul>
            </div>

            {/* Technical Information */}
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-600" />
                {t('dataCollection.technical.title')}
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{t('dataCollection.technical.items.0')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{t('dataCollection.technical.items.1')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{t('dataCollection.technical.items.2')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{t('dataCollection.technical.items.3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Usage */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t('dataUsage.title')}</h2>
          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <span>{t('dataUsage.items.0')}</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <span>{t('dataUsage.items.1')}</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <span>{t('dataUsage.items.2')}</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <span>{t('dataUsage.items.3')}</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <span>{t('dataUsage.items.4')}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Data Sharing */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t('dataSharing.title')}</h2>

          <div className="p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 mb-6">
            <h3 className="font-semibold text-lg mb-2 text-green-900 dark:text-green-100">
              {t('dataSharing.noSelling.title')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {t('dataSharing.noSelling.description')}
            </p>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('dataSharing.sharingCases')}
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <span>{t('dataSharing.cases.0')}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <span>{t('dataSharing.cases.1')}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <span>{t('dataSharing.cases.2')}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <span>{t('dataSharing.cases.3')}</span>
            </li>
          </ul>
        </section>

        {/* Data Security */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t('dataSecurity.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('dataSecurity.description')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold mb-1">
                {t('dataSecurity.measures.encryption.title')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('dataSecurity.measures.encryption.description')}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-1">
                {t('dataSecurity.measures.storage.title')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('dataSecurity.measures.storage.description')}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
              <h4 className="font-semibold mb-1">
                {t('dataSecurity.measures.audit.title')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('dataSecurity.measures.audit.description')}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <h4 className="font-semibold mb-1">
                {t('dataSecurity.measures.response.title')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('dataSecurity.measures.response.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t('yourRights.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('yourRights.description')}
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-1">
                {t('yourRights.access.title')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('yourRights.access.description')}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-1">
                {t('yourRights.correction.title')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('yourRights.correction.description')}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-1">
                {t('yourRights.deletion.title')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('yourRights.deletion.description')}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-1">
                {t('yourRights.portability.title')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('yourRights.portability.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Us */}
        <section className="p-8 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-4">
            <Mail className="h-8 w-8 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3">{t('contact.title')}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('contact.description')}
              </p>
              <p className="font-medium text-purple-600 mb-2">
                {t('contact.email')}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {t('contact.alternative')}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
