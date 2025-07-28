'use client'

import { AuthGuard } from '@/components/auth-guard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { PAGINATION } from '@/constants'
import { useToast } from '@/hooks/use-toast'
import {
  type DomainFavorite,
  favoritesApi,
  handleApiError,
} from '@/lib/api-client'
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Edit3,
  ExternalLink,
  Heart,
  Loader2,
  Search,
  Trash2,
  XCircle,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function FavoritesClient() {
  const t = useTranslations('favoritesPage')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // 状态管理
  const [favorites, setFavorites] = useState<DomainFavorite[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all')
  const [selectedFavorites, setSelectedFavorites] = useState<Set<string>>(
    new Set(),
  )
  const [batchMode, setBatchMode] = useState(false)
  const [editingFavorite, setEditingFavorite] = useState<DomainFavorite | null>(
    null,
  )
  const [editTags, setEditTags] = useState<string[]>([])
  const [editNotes, setEditNotes] = useState('')
  const [editAvailability, setEditAvailability] = useState<
    boolean | undefined
  >()
  const [newTag, setNewTag] = useState('')

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const limit = PAGINATION.DEFAULT_LIMIT
  const supabase = createClient()

  // 检查认证状态
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        setIsAuthenticated(true)
      } else {
        // 如果未认证，也设置 loading 为 false，让 AuthGuard 处理跳转
        setLoading(false)
      }
    }
    checkAuth()
  }, [supabase])

  // 加载收藏列表
  const loadFavorites = useCallback(async () => {
    // 只有在认证后才加载数据
    if (!isAuthenticated) {
      return
    }
    try {
      setLoading(true)
      const params: {
        page: number
        limit: number
        search?: string
        available?: boolean
      } = {
        page: currentPage,
        limit,
      }

      if (searchTerm) {
        params.search = searchTerm
      }

      if (availabilityFilter !== 'all') {
        params.available = availabilityFilter === 'available'
      }

      const response = await favoritesApi.getFavorites(params)

      if (response.success && response.data) {
        setFavorites(response.data.favorites)
        setTotalPages(response.data.pagination.total_pages)
        setTotalCount(response.data.pagination.total)
      } else {
        toast({
          title: t('toast.loadFailed'),
          description: t('toast.loadFailedDesc'),
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: t('toast.loadFailed'),
        description: t('toast.loadFailedDesc'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [
    currentPage,
    searchTerm,
    availabilityFilter,
    t,
    toast,
    limit,
    isAuthenticated,
  ])

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites()
    }
  }, [loadFavorites, isAuthenticated])

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  // 处理筛选
  const handleFilterChange = (value: string) => {
    setAvailabilityFilter(value)
    setCurrentPage(1)
  }

  // 切换选择
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedFavorites)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedFavorites(newSelected)
  }

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedFavorites.size === favorites.length) {
      setSelectedFavorites(new Set())
    } else {
      setSelectedFavorites(new Set(favorites.map((f) => f.id)))
    }
  }

  // 删除单个收藏
  const deleteFavorite = async (id: string) => {
    try {
      const response = await favoritesApi.deleteFavorite(id)
      if (response.success) {
        toast({
          title: t('toast.removed'),
          description: t('toast.removedDesc'),
        })
        loadFavorites()
      } else {
        toast({
          title: t('toast.deleteFailed'),
          description: handleApiError(response),
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: t('toast.deleteFailed'),
        description: t('toast.deleteFailedDesc'),
        variant: 'destructive',
      })
    }
  }

  // 批量删除
  const batchDelete = async () => {
    try {
      const ids = Array.from(selectedFavorites)
      const response = await favoritesApi.deleteFavorites(ids)
      if (response.success) {
        toast({
          title: t('toast.batchDeleteSuccess'),
          description: t('toast.batchDeleteSuccessDesc', { count: ids.length }),
        })
        setSelectedFavorites(new Set())
        setBatchMode(false)
        loadFavorites()
      } else {
        toast({
          title: t('toast.batchDeleteFailed'),
          description: handleApiError(response),
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: t('toast.batchDeleteFailed'),
        description: t('toast.batchDeleteFailedDesc'),
        variant: 'destructive',
      })
    }
  }

  // 开始编辑
  const startEdit = (favorite: DomainFavorite) => {
    setEditingFavorite(favorite)
    setEditTags(favorite.tags || [])
    setEditNotes(favorite.notes || '')
    setEditAvailability(favorite.is_available)
    setNewTag('')
  }

  // 添加标签
  const addTag = () => {
    if (newTag.trim() && !editTags.includes(newTag.trim())) {
      setEditTags([...editTags, newTag.trim()])
      setNewTag('')
    }
  }

  // 删除标签
  const removeTag = (tag: string) => {
    setEditTags(editTags.filter((t) => t !== tag))
  }

  // 保存编辑
  const saveEdit = async () => {
    if (!editingFavorite) {
      return
    }

    try {
      const response = await favoritesApi.updateFavorite(editingFavorite.id, {
        tags: editTags,
        notes: editNotes,
        is_available: editAvailability,
      })

      if (response.success) {
        toast({
          title: t('toast.updateSuccess'),
          description: t('toast.updateSuccessDesc'),
        })
        setEditingFavorite(null)
        loadFavorites()
      } else {
        toast({
          title: t('toast.updateFailed'),
          description: handleApiError(response),
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: t('toast.updateFailed'),
        description: t('toast.updateFailedDesc'),
        variant: 'destructive',
      })
    }
  }

  // 检查域名可用性
  const checkAvailability = async (domain: string) => {
    toast({
      title: t('toast.checking'),
      description: t('toast.checkingDesc', { domain }),
    })
    // TODO: 实际的域名检查逻辑
  }

  // 获取状态徽章
  const getStatusBadge = (isAvailable: boolean | undefined) => {
    if (isAvailable === true) {
      return (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle className="w-3 h-3 mr-1" />
          {t('status.available')}
        </Badge>
      )
    }
    if (isAvailable === false) {
      return (
        <Badge variant="secondary">
          <XCircle className="w-3 h-3 mr-1" />
          {t('status.registered')}
        </Badge>
      )
    }
    return <Badge variant="outline">{t('status.unchecked')}</Badge>
  }

  // 过滤和搜索
  const filteredFavorites = favorites

  return (
    <AuthGuard>
      <div className="space-y-6">
        {/* 标题 */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{t('title')}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        {/* 操作栏 */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* 搜索 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>

            {/* 筛选 */}
            <Select
              value={availabilityFilter}
              onValueChange={handleFilterChange}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filterAll')}</SelectItem>
                <SelectItem value="available">
                  {t('filterAvailable')}
                </SelectItem>
                <SelectItem value="registered">
                  {t('filterRegistered')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 批量操作 */}
          <div className="flex gap-2 w-full sm:w-auto">
            {batchMode ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setBatchMode(false)
                    setSelectedFavorites(new Set())
                  }}
                  className="flex-1 sm:flex-none"
                >
                  {t('cancelBatch')}
                </Button>
                <Button
                  variant="destructive"
                  onClick={batchDelete}
                  disabled={selectedFavorites.size === 0}
                  className="flex-1 sm:flex-none"
                >
                  {t('deleteSelected')} ({selectedFavorites.size})
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setBatchMode(true)}
                className="w-full sm:w-auto"
              >
                {t('batchManage')}
              </Button>
            )}
          </div>
        </div>

        {/* 批量选择提示 */}
        {batchMode && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={
                    selectedFavorites.size === favorites.length &&
                    favorites.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
                <div>
                  <p className="font-medium">{t('selectFavorites')}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedFavorites.size > 0
                      ? t('selectedCount', { count: selectedFavorites.size })
                      : t('clickToSelect')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 加载状态 */}
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">{t('loading')}</span>
            </CardContent>
          </Card>
        ) : filteredFavorites.length === 0 ? (
          /* 空状态 */
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">{t('empty.title')}</h3>
              <p className="text-muted-foreground text-center mb-4">
                {t('empty.description')}
              </p>
              <Button asChild>
                <Link href="/">{t('empty.searchButton')}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* 收藏列表 */
          <>
            <div className="text-sm text-muted-foreground mb-4">
              {searchTerm || availabilityFilter !== 'all'
                ? t('found', { count: totalCount })
                : t('total', { count: totalCount })}
            </div>

            <div className="grid gap-4">
              {filteredFavorites.map((favorite) => (
                <Card
                  key={favorite.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* 批量选择复选框 */}
                      {batchMode && (
                        <Checkbox
                          checked={selectedFavorites.has(favorite.id)}
                          onCheckedChange={() => toggleSelection(favorite.id)}
                          className="mt-1"
                        />
                      )}

                      {/* 主要内容 */}
                      <div className="flex-1 space-y-3">
                        {/* 域名和状态 */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="text-lg font-semibold break-all">
                            {favorite.domain}
                          </h3>
                          {getStatusBadge(favorite.is_available)}
                        </div>

                        {/* 标签 */}
                        {favorite.tags && favorite.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {favorite.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* 备注 */}
                        {favorite.notes && (
                          <p className="text-sm text-muted-foreground">
                            {favorite.notes}
                          </p>
                        )}

                        {/* 时间信息 */}
                        <div className="flex flex-col sm:flex-row gap-2 text-xs text-muted-foreground">
                          <span>
                            {t('dates.favoriteAt')}:{' '}
                            {new Date(favorite.created_at).toLocaleDateString()}
                          </span>
                          {favorite.last_checked_at && (
                            <span>
                              {t('dates.checkedAt')}:{' '}
                              {new Date(
                                favorite.last_checked_at,
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      {!batchMode && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(favorite)}
                            title={t('actions.edit')}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => checkAvailability(favorite.domain)}
                            title={t('actions.checkAvailability')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            title={t('viewDetails')}
                          >
                            <Link href={`/settings/favorites/${favorite.id}`}>
                              <Search className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteFavorite(favorite.id)}
                            title={t('actions.delete')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t('pagination.previous')}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {t('pagination.pageInfo', {
                    current: currentPage,
                    total: totalPages,
                  })}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  {t('pagination.next')}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* 编辑对话框 */}
        <Dialog
          open={!!editingFavorite}
          onOpenChange={() => setEditingFavorite(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('edit.title')}</DialogTitle>
              <DialogDescription>{t('edit.subtitle')}</DialogDescription>
            </DialogHeader>
            {editingFavorite && (
              <div className="space-y-4">
                {/* 标签编辑 */}
                <div className="space-y-2">
                  <label htmlFor="tags-input" className="text-sm font-medium">
                    {t('edit.tags')}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="tags-input"
                      placeholder={t('edit.tagPlaceholder')}
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} disabled={!newTag.trim()}>
                      {t('edit.addTag')}
                    </Button>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {editTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 备注编辑 */}
                <div className="space-y-2">
                  <label
                    htmlFor="notes-textarea"
                    className="text-sm font-medium"
                  >
                    {t('edit.notes')}
                  </label>
                  <Textarea
                    id="notes-textarea"
                    placeholder={t('edit.notesPlaceholder')}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* 可用性状态 */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    {t('edit.availability')}
                  </div>
                  <Select
                    value={
                      editAvailability === undefined
                        ? 'unchecked'
                        : editAvailability.toString()
                    }
                    onValueChange={(value) =>
                      setEditAvailability(
                        value === 'unchecked' ? undefined : value === 'true',
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unchecked">
                        {t('status.unchecked')}
                      </SelectItem>
                      <SelectItem value="true">
                        {t('status.available')}
                      </SelectItem>
                      <SelectItem value="false">
                        {t('status.registered')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2 pt-4">
                  <Button onClick={saveEdit} className="flex-1">
                    {t('edit.save')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingFavorite(null)}
                  >
                    取消
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  )
}
