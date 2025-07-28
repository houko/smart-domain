'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { API_LIMITS } from '@/constants'
import { useToast } from '@/hooks/use-toast'
import { generateApiKey, getApiKeyPrefix, hashApiKeyAsync } from '@/lib/api-key'
import { createClient } from '@/lib/supabase/client'
import type { ApiKey } from '@/types/api-key'
import {
  AlertCircle,
  Calendar,
  Clock,
  Copy,
  Key,
  Loader2,
  Plus,
  Trash2,
  Zap,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  tomorrow,
  vscDarkPlus,
} from 'react-syntax-highlighter/dist/esm/styles/prism'

export function ApiKeyManager() {
  const t = useTranslations('apiKeys')
  const { toast } = useToast()
  const { theme } = useTheme()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyDescription, setNewKeyDescription] = useState('')
  const [showNewKey, setShowNewKey] = useState(false)
  const [newApiKey, setNewApiKey] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedKeyUsage, setSelectedKeyUsage] = useState<{
    keyId: string
    keyName: string
    usage: Array<{
      id: string
      endpoint: string
      method: string
      status: number
      status_code?: number
      ip_address?: string
      created_at: string
    }>
  } | null>(null)
  const [usageDialogOpen, setUsageDialogOpen] = useState(false)
  const [monthlyUsage, setMonthlyUsage] = useState<Record<string, number>>({})
  const supabase = createClient()

  // 获取用户第一个API密钥的前缀，生成完整示例密钥
  const getExampleApiKey = () => {
    if (apiKeys.length > 0) {
      // 使用用户的真实前缀，补充示例后缀
      const userPrefix = apiKeys[0].key_prefix.replace('...', '')
      return `${userPrefix}aBcDeFgHiJkLmNoPqRsTuVwXyZ123456`
    }
    return 'sd_example_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456'
  }
  const exampleApiKey = getExampleApiKey()

  // 获取API基础URL
  const apiBaseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://smart-domain.com'

  // 根据主题选择代码高亮样式
  const codeTheme = theme === 'dark' ? vscDarkPlus : tomorrow

  // 加载API密钥列表
  const loadApiKeys = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setApiKeys(data || [])
    } catch (_error) {
      toast({
        title: t('loadFailed'),
        description: t('loadFailedDescription'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [supabase, toast, t])

  // 加载本月使用情况
  const loadMonthlyUsage = useCallback(async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7)
      const { data: keys } = await supabase.from('api_keys').select('id')

      if (keys) {
        const usageMap: Record<string, number> = {}

        for (const key of keys) {
          const { count } = await supabase
            .from('api_key_usage')
            .select('*', { count: 'exact', head: true })
            .eq('api_key_id', key.id)
            .gte('created_at', `${currentMonth}-01`)

          usageMap[key.id] = count || 0
        }

        setMonthlyUsage(usageMap)
      }
    } catch (error) {
      console.error('Failed to load monthly usage:', error)
    }
  }, [supabase])

  useEffect(() => {
    loadApiKeys()
    loadMonthlyUsage()
  }, [loadApiKeys, loadMonthlyUsage])

  // 创建新的API密钥
  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: t('nameRequired'),
        description: t('nameRequiredDescription'),
        variant: 'destructive',
      })
      return
    }

    setCreating(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        throw new Error(t('notLoggedIn'))
      }

      // 生成新的API密钥
      const apiKey = generateApiKey()
      const keyHash = await hashApiKeyAsync(apiKey)
      const keyPrefix = getApiKeyPrefix(apiKey)

      // 保存到数据库
      const { error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          name: newKeyName,
          key_hash: keyHash,
          key_prefix: keyPrefix,
          description: newKeyDescription || null,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      // 显示新创建的密钥
      setNewApiKey(apiKey)
      setShowNewKey(true)
      setDialogOpen(false)

      // 重置表单
      setNewKeyName('')
      setNewKeyDescription('')

      // 刷新列表
      await loadApiKeys()

      toast({
        title: t('createSuccess'),
        description: t('createSuccessDescription'),
      })
    } catch (_error) {
      toast({
        title: t('createFailed'),
        description: t('createFailedDescription'),
        variant: 'destructive',
      })
    } finally {
      setCreating(false)
    }
  }

  // 查看API使用情况
  const handleViewUsage = async (key: ApiKey) => {
    try {
      const { data, error } = await supabase
        .from('api_key_usage')
        .select('*')
        .eq('api_key_id', key.id)
        .order('created_at', { ascending: false })
        .limit(API_LIMITS.PAGINATION_MAX_LIMIT)

      if (error) {
        throw error
      }

      setSelectedKeyUsage({
        keyId: key.id,
        keyName: key.name,
        usage: data || [],
      })
      setUsageDialogOpen(true)
    } catch (_error) {
      toast({
        title: t('loadFailed'),
        description: t('loadFailedDescription'),
        variant: 'destructive',
      })
    }
  }

  // 删除API密钥
  const handleDeleteApiKey = async (id: string) => {
    try {
      const { error } = await supabase.from('api_keys').delete().eq('id', id)

      if (error) {
        throw error
      }

      await loadApiKeys()

      toast({
        title: t('deleteSuccess'),
        description: t('deleteSuccessDescription'),
      })
    } catch (_error) {
      toast({
        title: t('deleteFailed'),
        description: t('deleteFailedDescription'),
        variant: 'destructive',
      })
    }
  }

  // 复制API密钥
  const handleCopyApiKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key)
      toast({
        title: t('copySuccess'),
        description: t('copySuccessDescription'),
      })
    } catch (_error) {
      toast({
        title: t('copyFailed'),
        description: t('copyFailedDescription'),
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 新密钥显示对话框 */}
      <Dialog open={showNewKey} onOpenChange={setShowNewKey}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('newKeyTitle')}</DialogTitle>
            <DialogDescription>{t('newKeyDescription')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input value={newApiKey} readOnly className="font-mono text-sm" />
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleCopyApiKey(newApiKey)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-start space-x-2 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>{t('newKeyWarning')}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowNewKey(false)}>{t('saved')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 创建API密钥对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('createButton')}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('createTitle')}</DialogTitle>
            <DialogDescription>{t('createDescription')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="key-name">{t('keyName')} *</Label>
              <Input
                id="key-name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder={t('keyNamePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="key-description">{t('keyDescription')}</Label>
              <Input
                id="key-description"
                value={newKeyDescription}
                onChange={(e) => setNewKeyDescription(e.target.value)}
                placeholder={t('keyDescriptionPlaceholder')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={creating}
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleCreateApiKey}
              disabled={creating || !newKeyName.trim()}
            >
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('creating')}
                </>
              ) : (
                t('create')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* API密钥列表 */}
      {apiKeys.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Key className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">{t('noKeys')}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {t('noKeysDescription')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {apiKeys.map((apiKey) => (
            <Card key={apiKey.id}>
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col space-y-3 md:flex-row md:items-start md:justify-between md:space-y-0">
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                      <p className="font-medium text-sm md:text-base truncate">
                        {apiKey.name}
                      </p>
                      <code className="text-xs md:text-sm text-muted-foreground font-mono break-all bg-muted px-1.5 py-0.5 rounded">
                        {apiKey.key_prefix}
                      </code>
                    </div>
                    {apiKey.description && (
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {apiKey.description}
                      </p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2 md:gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 min-w-0">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                          {t('createdAt')}{' '}
                          {new Date(apiKey.created_at).toLocaleDateString(
                            'zh-CN',
                          )}
                        </span>
                      </span>
                      {apiKey.last_used_at && (
                        <span className="flex items-center gap-1 min-w-0">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            {t('lastUsed')}{' '}
                            {new Date(apiKey.last_used_at).toLocaleDateString(
                              'zh-CN',
                            )}
                          </span>
                        </span>
                      )}
                      {monthlyUsage[apiKey.id] !== undefined && (
                        <span className="flex items-center gap-1 min-w-0">
                          <Zap className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            {t('monthlyUsage', {
                              count: monthlyUsage[apiKey.id],
                            })}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                      onClick={async () => {
                        const curlCommand = `# 请将下方的 ${apiKey.key_prefix} 替换为您的完整API密钥
curl -X POST ${apiBaseUrl}/api/v1/generate \\
  -H "Authorization: Bearer ${apiKey.key_prefix}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "description": "${t('usageInstructions.smartHomeExample')}",
    "options": {
      "maxSuggestions": 3,
      "includePricing": true,
      "targetMarket": "global",
      "preferredTlds": [".com", ".io"]
    }
  }'`
                        await navigator.clipboard.writeText(curlCommand)
                        toast({
                          title: t('copySuccess'),
                          description: t('curlCopyDescription'),
                        })
                      }}
                      title={t('copyCurlCommand')}
                    >
                      <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewUsage(apiKey)}
                      title={t('viewUsage')}
                      className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                    >
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 h-8 w-8 p-0 sm:h-9 sm:w-9"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t('deleteConfirm')}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('deleteDescription')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteApiKey(apiKey.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {t('delete')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('usageInstructions.title')}</CardTitle>
          <CardDescription>
            {t('usageInstructions.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <code className="text-sm">
              Authorization: Bearer {exampleApiKey}
            </code>
          </div>

          {/* 代码示例 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              {t('usageInstructions.codeExamples')}
            </h4>

            {/* API密钥提示 */}
            {apiKeys.length > 0 && (
              <div className="flex items-start space-x-2 rounded-md bg-amber-50 dark:bg-amber-950 p-3 text-sm text-amber-800 dark:text-amber-200">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-medium">重要提示：请使用完整的API密钥</p>
                  <p className="text-xs">
                    下方示例使用的是示例密钥，请替换为您在创建时保存的真实完整密钥。
                  </p>
                  <p className="text-xs">
                    完整密钥格式类似：sd_mdb3drw3_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456
                  </p>
                </div>
              </div>
            )}

            <Tabs defaultValue="curl" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 h-auto p-1">
                <TabsTrigger
                  value="curl"
                  className="text-xs sm:text-sm px-2 py-1.5"
                >
                  cURL
                </TabsTrigger>
                <TabsTrigger
                  value="javascript"
                  className="text-xs sm:text-sm px-2 py-1.5"
                >
                  JavaScript
                </TabsTrigger>
                <TabsTrigger
                  value="python"
                  className="text-xs sm:text-sm px-2 py-1.5"
                >
                  Python
                </TabsTrigger>
                <TabsTrigger
                  value="nodejs"
                  className="text-xs sm:text-sm px-2 py-1.5"
                >
                  Node.js
                </TabsTrigger>
                <TabsTrigger
                  value="php"
                  className="text-xs sm:text-sm px-2 py-1.5"
                >
                  PHP
                </TabsTrigger>
              </TabsList>

              {/* cURL 示例 */}
              <TabsContent value="curl" className="space-y-2">
                <div className="relative">
                  <div className="rounded-md overflow-hidden">
                    <div className="text-xs sm:text-sm [&_code]:!text-xs [&_code]:sm:!text-sm">
                      <SyntaxHighlighter
                        language="bash"
                        style={codeTheme}
                        customStyle={{
                          margin: 0,
                          fontSize: '0.75rem',
                          lineHeight: '1.5',
                          paddingTop: '2.5rem',
                          paddingLeft: '0.75rem',
                          paddingRight: '0.75rem',
                        }}
                      >
                        {`# 请将下方的 ${exampleApiKey} 替换为您的完整API密钥
curl -X POST ${apiBaseUrl}/api/v1/generate \\
  -H "Authorization: Bearer ${exampleApiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "description": "${t('usageInstructions.smartHomeExample')}",
    "options": {
      "maxSuggestions": 3,
      "includePricing": true,
      "targetMarket": "global",
      "preferredTlds": [".com", ".io"]
    }
  }'`}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 text-xs sm:text-sm px-2 py-1"
                    onClick={async () => {
                      const curlCommand = `# 请将下方的 ${exampleApiKey} 替换为您的完整API密钥
curl -X POST ${apiBaseUrl}/api/v1/generate \\
  -H "Authorization: Bearer ${exampleApiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "description": "${t('usageInstructions.smartHomeExample')}",
    "options": {
      "maxSuggestions": 3,
      "includePricing": true,
      "targetMarket": "global",
      "preferredTlds": [".com", ".io"]
    }
  }'`
                      await navigator.clipboard.writeText(curlCommand)
                      toast({
                        title: t('copySuccess'),
                        description: t('curlCopyDescription'),
                      })
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="rounded-md bg-muted p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium">
                      {t('usageInstructions.healthCheckTitle')}
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={async () => {
                          try {
                            const response = await fetch(
                              `${apiBaseUrl}/api/v1/health`,
                            )
                            const data = await response.json()

                            if (response.ok && data.status === 'healthy') {
                              toast({
                                title: t(
                                  'usageInstructions.healthCheckSuccess',
                                ),
                                description: t(
                                  'usageInstructions.healthCheckSuccessDesc',
                                  { status: data.database || 'connected' },
                                ),
                              })
                            } else {
                              toast({
                                title: t('usageInstructions.healthCheckError'),
                                description:
                                  data.error ||
                                  t('usageInstructions.healthCheckErrorDesc'),
                                variant: 'destructive',
                              })
                            }
                          } catch (error) {
                            toast({
                              title: t('usageInstructions.healthCheckFailed'),
                              description: t(
                                'usageInstructions.healthCheckFailedDesc',
                              ),
                              variant: 'destructive',
                            })
                          }
                        }}
                      >
                        <Zap className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={async () => {
                          const healthCommand = `curl -X GET ${apiBaseUrl}/api/v1/health`
                          await navigator.clipboard.writeText(healthCommand)
                          toast({
                            title: t('copySuccess'),
                            description: t(
                              'usageInstructions.healthCheckCopySuccess',
                            ),
                          })
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <code className="text-xs block">
                      GET ${apiBaseUrl}/api/v1/health
                    </code>
                    <code className="text-xs block text-muted-foreground">
                      curl -X GET ${apiBaseUrl}/api/v1/health
                    </code>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t('usageInstructions.expectedResponse')}:{' '}
                    <code className="text-green-600">
                      {'{ "status": "healthy" }'}
                    </code>
                  </div>
                </div>
              </TabsContent>

              {/* JavaScript 示例 */}
              <TabsContent value="javascript">
                <div className="space-y-4">
                  <div className="relative">
                    <div className="rounded-md overflow-hidden">
                      <div className="text-xs sm:text-sm [&_code]:!text-xs [&_code]:sm:!text-sm">
                        <SyntaxHighlighter
                          language="javascript"
                          style={codeTheme}
                          customStyle={{
                            margin: 0,
                            fontSize: '0.75rem',
                            lineHeight: '1.5',
                            paddingTop: '2.5rem',
                            paddingLeft: '0.75rem',
                            paddingRight: '0.75rem',
                          }}
                        >
                          {`// 请将下方的 ${exampleApiKey} 替换为您的完整API密钥
const response = await fetch('${apiBaseUrl}/api/v1/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${exampleApiKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    description: '${t('usageInstructions.smartHomeExample')}',
    options: { maxSuggestions: 3 }
  })
});
const data = await response.json();`}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 text-xs sm:text-sm px-2 py-1"
                      onClick={async () => {
                        const code = `// 请将下方的 ${exampleApiKey} 替换为您的完整API密钥
const response = await fetch('${apiBaseUrl}/api/v1/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${exampleApiKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    description: '${t('usageInstructions.smartHomeExample')}',
    options: { maxSuggestions: 3 }
  })
});
const data = await response.json();`
                        await navigator.clipboard.writeText(code)
                        toast({ title: t('copySuccess') })
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="rounded-md bg-muted p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium">
                        {t('usageInstructions.healthCheckTitle')}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={async () => {
                          const healthCode = `// 健康检查\nconst health = await fetch('${apiBaseUrl}/api/v1/health');\nconst status = await health.json();\nconsole.log(status);`
                          await navigator.clipboard.writeText(healthCode)
                          toast({
                            title: t('copySuccess'),
                            description: t(
                              'usageInstructions.healthCheckCodeCopySuccess',
                            ),
                          })
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-xs block text-muted-foreground">
                      fetch('${apiBaseUrl}/api/v1/health')
                    </code>
                  </div>
                </div>
              </TabsContent>

              {/* Python 示例 */}
              <TabsContent value="python">
                <div className="space-y-4">
                  <div className="relative">
                    <div className="rounded-md overflow-hidden">
                      <div className="text-xs sm:text-sm [&_code]:!text-xs [&_code]:sm:!text-sm">
                        <SyntaxHighlighter
                          language="python"
                          style={codeTheme}
                          customStyle={{
                            margin: 0,
                            fontSize: '0.75rem',
                            lineHeight: '1.5',
                            paddingTop: '2.5rem',
                            paddingLeft: '0.75rem',
                            paddingRight: '0.75rem',
                          }}
                        >
                          {`import requests

# 请将下方的 ${exampleApiKey} 替换为您的完整API密钥
response = requests.post(
    '${apiBaseUrl}/api/v1/generate',
    headers={
        'Authorization': 'Bearer ${exampleApiKey}',
        'Content-Type': 'application/json'
    },
    json={
        'description': '${t('usageInstructions.smartHomeExample')}',
        'options': {'maxSuggestions': 3}
    }
)
data = response.json()`}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 text-xs sm:text-sm px-2 py-1"
                      onClick={async () => {
                        const code = `import requests

# 请将下方的 ${exampleApiKey} 替换为您的完整API密钥
response = requests.post(
    '${apiBaseUrl}/api/v1/generate',
    headers={
        'Authorization': 'Bearer ${exampleApiKey}',
        'Content-Type': 'application/json'
    },
    json={
        'description': '${t('usageInstructions.smartHomeExample')}',
        'options': {'maxSuggestions': 3}
    }
)
data = response.json()`
                        await navigator.clipboard.writeText(code)
                        toast({ title: t('copySuccess') })
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="rounded-md bg-muted p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium">
                        {t('usageInstructions.healthCheckTitle')}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={async () => {
                          const healthCode = `# 健康检查\nimport requests\nhealth = requests.get('${apiBaseUrl}/api/v1/health')\nprint(health.json())`
                          await navigator.clipboard.writeText(healthCode)
                          toast({
                            title: t('copySuccess'),
                            description: t(
                              'usageInstructions.healthCheckCodeCopySuccess',
                            ),
                          })
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-xs block text-muted-foreground">
                      requests.get('${apiBaseUrl}/api/v1/health')
                    </code>
                  </div>
                </div>
              </TabsContent>

              {/* Node.js 示例 */}
              <TabsContent value="nodejs">
                <div className="space-y-4">
                  <div className="relative">
                    <div className="rounded-md overflow-hidden">
                      <div className="text-xs sm:text-sm [&_code]:!text-xs [&_code]:sm:!text-sm">
                        <SyntaxHighlighter
                          language="javascript"
                          style={codeTheme}
                          customStyle={{
                            margin: 0,
                            fontSize: '0.75rem',
                            lineHeight: '1.5',
                            paddingTop: '2.5rem',
                            paddingLeft: '0.75rem',
                            paddingRight: '0.75rem',
                          }}
                        >
                          {`const axios = require('axios');

// 请将下方的 ${exampleApiKey} 替换为您的完整API密钥
const response = await axios.post('${apiBaseUrl}/api/v1/generate', {
  description: '${t('usageInstructions.smartHomeExample')}',
  options: { maxSuggestions: 3 }
}, {
  headers: {
    'Authorization': 'Bearer ${exampleApiKey}',
    'Content-Type': 'application/json'
  }
});
console.log(response.data);`}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 text-xs sm:text-sm px-2 py-1"
                      onClick={async () => {
                        const code = `const axios = require('axios');

// 请将下方的 ${exampleApiKey} 替换为您的完整API密钥
const response = await axios.post('${apiBaseUrl}/api/v1/generate', {
  description: '${t('usageInstructions.smartHomeExample')}',
  options: { maxSuggestions: 3 }
}, {
  headers: {
    'Authorization': 'Bearer ${exampleApiKey}',
    'Content-Type': 'application/json'
  }
});
console.log(response.data);`
                        await navigator.clipboard.writeText(code)
                        toast({ title: t('copySuccess') })
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="rounded-md bg-muted p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium">
                        {t('usageInstructions.healthCheckTitle')}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={async () => {
                          const healthCode = `// 健康检查\nconst axios = require('axios');\nconst health = await axios.get('${apiBaseUrl}/api/v1/health');\nconsole.log(health.data);`
                          await navigator.clipboard.writeText(healthCode)
                          toast({
                            title: t('copySuccess'),
                            description: t(
                              'usageInstructions.healthCheckCodeCopySuccess',
                            ),
                          })
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-xs block text-muted-foreground">
                      axios.get('${apiBaseUrl}/api/v1/health')
                    </code>
                  </div>
                </div>
              </TabsContent>

              {/* PHP 示例 */}
              <TabsContent value="php">
                <div className="space-y-4">
                  <div className="relative">
                    <div className="rounded-md overflow-hidden">
                      <div className="text-xs sm:text-sm [&_code]:!text-xs [&_code]:sm:!text-sm">
                        <SyntaxHighlighter
                          language="php"
                          style={codeTheme}
                          customStyle={{
                            margin: 0,
                            fontSize: '0.75rem',
                            lineHeight: '1.5',
                            paddingTop: '2.5rem',
                            paddingLeft: '0.75rem',
                            paddingRight: '0.75rem',
                          }}
                        >
                          {`<?php
// 请将下方的 ${exampleApiKey} 替换为您的完整API密钥
$ch = curl_init('${apiBaseUrl}/api/v1/generate');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ${exampleApiKey}',
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'description' => '${t('usageInstructions.smartHomeExample')}',
    'options' => ['maxSuggestions' => 3]
]));
$response = curl_exec($ch);
curl_close($ch);
$data = json_decode($response, true);`}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 text-xs sm:text-sm px-2 py-1"
                      onClick={async () => {
                        const code = `<?php
// 请将下方的 ${exampleApiKey} 替换为您的完整API密钥
$ch = curl_init('${apiBaseUrl}/api/v1/generate');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ${exampleApiKey}',
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'description' => '${t('usageInstructions.smartHomeExample')}',
    'options' => ['maxSuggestions' => 3]
]));
$response = curl_exec($ch);
curl_close($ch);
$data = json_decode($response, true);`
                        await navigator.clipboard.writeText(code)
                        toast({ title: t('copySuccess') })
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="rounded-md bg-muted p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium">
                        {t('usageInstructions.healthCheckTitle')}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={async () => {
                          const healthCode = `<?php\n// 健康检查\n$health = file_get_contents('${apiBaseUrl}/api/v1/health');\n$status = json_decode($health, true);\nprint_r($status);`
                          await navigator.clipboard.writeText(healthCode)
                          toast({
                            title: t('copySuccess'),
                            description: t(
                              'usageInstructions.healthCheckCodeCopySuccess',
                            ),
                          })
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <code className="text-xs block text-muted-foreground">
                      file_get_contents('${apiBaseUrl}/api/v1/health')
                    </code>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• {t('usageInstructions.notes.apiKeyAuth')}</p>
            <p>• {t('usageInstructions.notes.secureStorage')}</p>
            <p>• {t('usageInstructions.notes.keyRotation')}</p>
            <p>• {t('usageInstructions.notes.rateLimits')}</p>
            <p>
              • <strong>安全建议</strong>
              ：使用环境变量存储API密钥，避免在代码中硬编码
            </p>
          </div>

          {/* 环境变量最佳实践 */}
          <div className="rounded-md bg-blue-50 dark:bg-blue-950 p-3 sm:p-4 space-y-3">
            <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              🔒 安全最佳实践：使用环境变量
            </h5>
            <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 space-y-2">
              <p>推荐将API密钥存储在环境变量中，而不是直接写在代码里：</p>
              <div className="space-y-2">
                <code className="block bg-blue-100 dark:bg-blue-900 p-2 sm:p-3 rounded text-xs sm:text-sm overflow-x-auto">
                  # .env 文件{'\n'}
                  SMART_DOMAIN_API_KEY=your_complete_api_key_here
                </code>
                <code className="block bg-blue-100 dark:bg-blue-900 p-2 sm:p-3 rounded text-xs sm:text-sm overflow-x-auto">
                  {`# 在代码中使用\n'Authorization': 'Bearer ' + process.env.SMART_DOMAIN_API_KEY`}
                </code>
              </div>
              <p>💡 这样可以避免密钥泄露到版本控制系统中，提高安全性。</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 使用情况对话框 */}
      <Dialog open={usageDialogOpen} onOpenChange={setUsageDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {t('usageDialog.title')} - {selectedKeyUsage?.keyName}
            </DialogTitle>
            <DialogDescription>{t('usageDialog.subtitle')}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {selectedKeyUsage?.usage.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t('usageDialog.noRecords')}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-2">
                      {t('usageDialog.tableHeaders.time')}
                    </th>
                    <th className="text-left p-2">
                      {t('usageDialog.tableHeaders.endpoint')}
                    </th>
                    <th className="text-left p-2">
                      {t('usageDialog.tableHeaders.method')}
                    </th>
                    <th className="text-left p-2">
                      {t('usageDialog.tableHeaders.status')}
                    </th>
                    <th className="text-left p-2">
                      {t('usageDialog.tableHeaders.ipAddress')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedKeyUsage?.usage.map((record) => (
                    <tr key={record.id} className="border-b">
                      <td className="p-2 text-muted-foreground">
                        {new Date(record.created_at).toLocaleString('zh-CN')}
                      </td>
                      <td className="p-2 font-mono text-xs">
                        {record.endpoint}
                      </td>
                      <td className="p-2">
                        <Badge variant="outline">{record.method}</Badge>
                      </td>
                      <td className="p-2">
                        <Badge
                          variant={
                            (record.status_code || record.status) === 200
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {record.status_code || record.status}
                        </Badge>
                      </td>
                      <td className="p-2 text-muted-foreground text-xs">
                        {record.ip_address || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUsageDialogOpen(false)}>
              {t('usageDialog.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
