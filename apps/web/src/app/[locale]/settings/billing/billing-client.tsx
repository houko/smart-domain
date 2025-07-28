'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Check, Loader2, X, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

import { AuthGuard } from '@/components/auth-guard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'

export function BillingClient() {
  const t = useTranslations('billing')
  const { toast } = useToast()
  const [currentPlan, setCurrentPlan] = useState('free')
  const [loading, setLoading] = useState(false)
  const [usage, _setUsage] = useState({
    queries: 23,
    limit: 50,
    resetDate: '2024-08-01',
  })

  const allPlans = [
    {
      id: 'free',
      name: t('plans.free'),
      price: '¥0',
      period: t('perMonth'),
      features: [
        { name: t('features.monthlyQueries50'), included: true },
        { name: t('features.basicAI'), included: true },
        { name: t('features.searchHistory7Days'), included: true },
        { name: t('features.batchQuery'), included: false },
        { name: t('features.advancedAI'), included: false },
        { name: t('features.apiAccess'), included: false },
        { name: t('features.prioritySupport'), included: false },
      ],
    },
    {
      id: 'pro',
      name: t('plans.pro'),
      price: '¥19',
      period: t('perMonth'),
      features: [
        { name: t('features.monthlyQueries500'), included: true },
        { name: t('features.advancedAI'), included: true },
        { name: t('features.unlimitedHistory'), included: true },
        { name: t('features.batchQuery50'), included: true },
        { name: t('features.apiAccess'), included: true },
        { name: t('features.prioritySupport'), included: true },
        { name: t('features.customDomainSuggestions'), included: true },
      ],
    },
    {
      id: 'enterprise',
      name: t('plans.enterprise'),
      price: '¥39',
      period: t('perMonth'),
      features: [
        { name: t('features.unlimitedQueries'), included: true },
        { name: t('features.enterpriseAI'), included: true },
        { name: t('features.dataExport'), included: true },
        { name: t('features.batchQueryUnlimited'), included: true },
        { name: t('features.fullApiAccess'), included: true },
        { name: t('features.support247'), included: true },
        { name: t('features.customSolutions'), included: true },
      ],
    },
  ]

  useEffect(() => {
    // 这里应该从后端获取用户的订阅信息和使用情况
    // 暂时使用模拟数据
  }, [])

  const handleUpgrade = async (planId: string) => {
    setLoading(true)
    try {
      // 这里应该调用支付API
      await new Promise((resolve) => setTimeout(resolve, 2000)) // 模拟API调用

      setCurrentPlan(planId)
      toast({
        title: t('upgradeSuccess'),
        description: t('upgradeSuccessDescription'),
      })
    } catch (_error) {
      toast({
        title: t('upgradeFailed'),
        description: t('upgradeFailedDescription'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{t('title')}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        {/* 当前套餐使用情况 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('currentUsage')}</CardTitle>
            <CardDescription>{t('currentUsageDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                <span className="text-sm font-medium">{t('domainQuery')}</span>
                <span className="text-sm text-muted-foreground">
                  {usage.queries} / {usage.limit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${(usage.queries / usage.limit) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t('usageResetOn', { date: usage.resetDate })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 订阅套餐 */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {allPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col h-full ${
                currentPlan === plan.id ? 'border-primary' : ''
              }`}
            >
              {currentPlan === plan.id && (
                <Badge className="absolute -top-2 left-4">
                  {t('currentPlanButton')}
                </Badge>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                  {plan.name}
                  {plan.id === 'pro' && (
                    <Zap className="h-4 w-4 text-yellow-500" />
                  )}
                </CardTitle>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                  {plan.price}
                  <span className="text-sm sm:text-base md:text-lg font-normal text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 space-y-4 pt-0">
                <ul className="space-y-2 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300 mt-0.5 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? '' : 'text-muted-foreground'
                        }`}
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-auto"
                  variant={currentPlan === plan.id ? 'outline' : 'default'}
                  disabled={currentPlan === plan.id || loading}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : currentPlan === plan.id ? (
                    t('currentPlanButton')
                  ) : (
                    t('upgradeButton')
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 计费历史 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('billingHistory')}</CardTitle>
            <CardDescription>{t('billingHistoryDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              {t('noBillingHistory')}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
