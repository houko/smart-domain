import { getRedisClient } from './redis'
import type {
  AnalysisResult,
  DomainInfo,
  ProjectName,
} from '@smart-domain/types'

const DEFAULT_TTL = 3600 // 1 hour

export class CacheManager {
  private keyPrefix = 'smart-domain:'

  private getKey(type: string, id: string): string {
    return `${this.keyPrefix}${type}:${id}`
  }

  // 缓存分析结果
  async cacheAnalysis(
    description: string,
    result: AnalysisResult,
  ): Promise<void> {
    const client = await getRedisClient()
    const key = this.getKey('analysis', this.hashString(description))
    await client.setEx(key, DEFAULT_TTL, JSON.stringify(result))
  }

  async getAnalysis(description: string): Promise<AnalysisResult | null> {
    const client = await getRedisClient()
    const key = this.getKey('analysis', this.hashString(description))
    const cached = await client.get(key)
    return cached ? JSON.parse(cached) : null
  }

  // 缓存项目名生成结果
  async cacheProjectNames(
    keywords: string[],
    results: ProjectName[],
  ): Promise<void> {
    const client = await getRedisClient()
    const key = this.getKey('projectnames', this.hashArray(keywords))
    await client.setEx(key, DEFAULT_TTL, JSON.stringify(results))
  }

  async getProjectNames(keywords: string[]): Promise<ProjectName[] | null> {
    const client = await getRedisClient()
    const key = this.getKey('projectnames', this.hashArray(keywords))
    const cached = await client.get(key)
    return cached ? JSON.parse(cached) : null
  }

  // 缓存域名查询结果
  async cacheDomainCheck(domain: string, result: DomainInfo): Promise<void> {
    const client = await getRedisClient()
    const key = this.getKey('domain', domain)
    await client.setEx(key, DEFAULT_TTL / 2, JSON.stringify(result)) // 30分钟
  }

  async getDomainCheck(domain: string): Promise<DomainInfo | null> {
    const client = await getRedisClient()
    const key = this.getKey('domain', domain)
    const cached = await client.get(key)
    return cached ? JSON.parse(cached) : null
  }

  // 批量获取域名检查结果
  async batchGetDomainChecks(
    domains: string[],
  ): Promise<Map<string, DomainInfo>> {
    const client = await getRedisClient()
    const results = new Map<string, DomainInfo>()

    const keys = domains.map((domain) => this.getKey('domain', domain))
    const values = await client.mGet(keys)

    values.forEach((value, index) => {
      if (value) {
        results.set(domains[index], JSON.parse(value))
      }
    })

    return results
  }

  // 清除特定类型的缓存
  async clearCache(
    type: 'analysis' | 'projectnames' | 'domain',
  ): Promise<void> {
    const client = await getRedisClient()
    const pattern = `${this.keyPrefix}${type}:*`
    const keys = await client.keys(pattern)

    if (keys.length > 0) {
      await client.del(keys)
    }
  }

  // 简单的字符串哈希函数
  private hashString(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16)
  }

  private hashArray(arr: string[]): string {
    return this.hashString(arr.sort().join(','))
  }
}

export const cacheManager = new CacheManager()
