'use client'

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Scale,
  Shield,
  Users,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function TermsPage() {
  const t = useTranslations('terms')

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
      <div className="container px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {t('title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t('lastUpdated', {
            date: t('date'),
            effectiveDate: t('effectiveDate'),
          })}
        </p>

        {/* Important Notice */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                {t('importantNotice.title')}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {t('importantNotice.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Terms Overview */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6 text-purple-600" />
            {t('overview.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <CheckCircle className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-semibold mb-1">
                {t('overview.freeUse.title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('overview.freeUse.description')}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <Shield className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold mb-1">
                {t('overview.dataSecurity.title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('overview.dataSecurity.description')}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
              <Scale className="h-8 w-8 text-cyan-600 mb-2" />
              <h3 className="font-semibold mb-1">
                {t('overview.fairUse.title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('overview.fairUse.description')}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-semibold mb-1">
                {t('overview.userResponsibility.title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('overview.userResponsibility.description')}
              </p>
            </div>
          </div>
        </section>

        {/* 1. Service Description */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t('serviceDescription.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('serviceDescription.description')}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('serviceDescription.includes')}
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400 ml-4">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <span>{t('serviceDescription.features.0')}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <span>{t('serviceDescription.features.1')}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <span>{t('serviceDescription.features.2')}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <span>{t('serviceDescription.features.3')}</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              <span>{t('serviceDescription.features.4')}</span>
            </li>
          </ul>
        </section>

        {/* 2. Usage Terms */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t('usageTerms.title')}</h2>

          {/* 2.1 Account Registration */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t('usageTerms.accountRegistration.title')}
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>{t('usageTerms.accountRegistration.items.0')}</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>{t('usageTerms.accountRegistration.items.1')}</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>{t('usageTerms.accountRegistration.items.2')}</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>{t('usageTerms.accountRegistration.items.3')}</span>
              </li>
            </ul>
          </div>

          {/* 2.2 Acceptable Use */}
          <div>
            <h3 className="text-xl font-semibold mb-3">
              {t('usageTerms.acceptableUse.title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {t('usageTerms.acceptableUse.description')}
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>{t('usageTerms.acceptableUse.items.0')}</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>{t('usageTerms.acceptableUse.items.1')}</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>{t('usageTerms.acceptableUse.items.2')}</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>{t('usageTerms.acceptableUse.items.3')}</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>{t('usageTerms.acceptableUse.items.4')}</span>
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>{t('usageTerms.acceptableUse.items.5')}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 3. Intellectual Property */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t('intellectualProperty.title')}
          </h2>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-2">
                {t('intellectualProperty.yourContent.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('intellectualProperty.yourContent.description')}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-2">
                {t('intellectualProperty.ourContent.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('intellectualProperty.ourContent.description')}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-2">
                {t('intellectualProperty.domainSuggestions.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('intellectualProperty.domainSuggestions.description')}
              </p>
            </div>
          </div>
        </section>

        {/* 4. Paid Services and Refunds */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t('paidServices.title')}</h2>

          {/* 4.1 Subscription and Billing */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">
              {t('paidServices.subscription.title')}
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>{t('paidServices.subscription.items.0')}</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>{t('paidServices.subscription.items.1')}</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>{t('paidServices.subscription.items.2')}</span>
              </li>
            </ul>
          </div>

          {/* 4.2 Refund Policy */}
          <div className="p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold mb-2">
              {t('paidServices.refundPolicy.title')}
            </h3>
            <p className="text-lg font-medium text-green-900 dark:text-green-100 mb-2">
              ✅ {t('paidServices.refundPolicy.highlight')}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {t('paidServices.refundPolicy.description')}
            </p>
          </div>
        </section>

        {/* 5. Disclaimer and Limitation of Liability */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t('disclaimer.title')}</h2>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-1">
                {t('disclaimer.asIs.title')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('disclaimer.asIs.description')}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-1">
                {t('disclaimer.domainAvailability.title')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('disclaimer.domainAvailability.description')}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-1">
                {t('disclaimer.liability.title')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('disclaimer.liability.description')}
              </p>
            </div>
          </div>
        </section>

        {/* 6. Privacy and Data Protection */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            {t('privacyAndData.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            {t('privacyAndData.description')}
          </p>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            🔒 {t('privacyAndData.commitment')}
          </p>
        </section>

        {/* 7. Termination */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{t('termination.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t('termination.userTermination')}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            {t('termination.ourRights')}
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
              <span>{t('termination.reasons.0')}</span>
            </li>
            <li className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
              <span>{t('termination.reasons.1')}</span>
            </li>
            <li className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
              <span>{t('termination.reasons.2')}</span>
            </li>
          </ul>
        </section>

        {/* 8. Modifications to Terms */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6 text-purple-600" />
            {t('modifications.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('modifications.description')}
          </p>
        </section>
      </div>
    </div>
  )
}
