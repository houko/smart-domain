// GoDaddy API 集成
interface GoDaddyConfig {
  apiKey: string
  apiSecret: string
  baseUrl?: string
}

interface GoDaddyDomainAvailability {
  available: boolean
  domain: string
  definitive: boolean
  price?: number
  currency?: string
  period?: number
}

// 价格信息结构（保留以备后续使用）
// interface GoDaddyDomainPrice {
//   domain: string
//   price: number
//   currency: string
//   period: number
// }

export class GoDaddyAPI {
  private config: GoDaddyConfig
  private baseUrl: string

  constructor(config: GoDaddyConfig) {
    this.config = config
    // 使用 OTE (测试环境) 或生产环境
    this.baseUrl = config.baseUrl || 'https://api.godaddy.com'
  }

  private getAuthHeaders() {
    return {
      Authorization: `sso-key ${this.config.apiKey}:${this.config.apiSecret}`,
      'Content-Type': 'application/json',
    }
  }

  // 检查域名可用性
  async checkAvailability(domain: string): Promise<GoDaddyDomainAvailability> {
    try {
      const url = `${this.baseUrl}/v1/domains/available?domain=${encodeURIComponent(domain)}`

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        const errorBody = await response.text()
        console.error(
          `GoDaddy API Response: ${response.status} ${response.statusText}`,
          errorBody,
        )
        throw new Error(
          `GoDaddy API error: ${response.status} ${response.statusText} - ${errorBody}`,
        )
      }

      const data = (await response.json()) as GoDaddyDomainAvailability
      return data
    } catch (error) {
      console.error(
        `Error checking domain availability with GoDaddy API:`,
        error,
      )
      throw error
    }
  }

  // 批量检查域名可用性
  async checkAvailabilityBulk(
    domains: string[],
  ): Promise<GoDaddyDomainAvailability[]> {
    try {
      const url = `${this.baseUrl}/v1/domains/available`

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(domains),
      })

      if (!response.ok) {
        const errorBody = await response.text()
        console.error(
          `GoDaddy API Response: ${response.status} ${response.statusText}`,
          errorBody,
        )
        throw new Error(
          `GoDaddy API error: ${response.status} ${response.statusText} - ${errorBody}`,
        )
      }

      const data = (await response.json()) as {
        domains: GoDaddyDomainAvailability[]
      }
      return data.domains || []
    } catch (error) {
      console.error(
        `Error checking bulk domain availability with GoDaddy API:`,
        error,
      )
      throw error
    }
  }

  // 获取域名建议价格
  async getSuggestedPrice(tld: string): Promise<number> {
    try {
      const url = `${this.baseUrl}/v1/domains/tlds`

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        const errorBody = await response.text()
        console.error(
          `GoDaddy API Response: ${response.status} ${response.statusText}`,
          errorBody,
        )
        throw new Error(
          `GoDaddy API error: ${response.status} ${response.statusText} - ${errorBody}`,
        )
      }

      const tlds = (await response.json()) as Array<{
        name: string
        price?: number
      }>
      const tldInfo = tlds.find((t) => t.name === tld.replace('.', ''))

      // OTE 环境可能返回 0 或没有价格
      const price = tldInfo?.price || 0
      return price > 0 ? price : 0
    } catch (error) {
      console.error(`Error getting TLD price from GoDaddy API:`, error)
      throw error
    }
  }
}

// 创建单例实例
let godaddyInstance: GoDaddyAPI | null = null

export function getGoDaddyAPI(
  apiKey?: string,
  apiSecret?: string,
): GoDaddyAPI | null {
  const key = apiKey || process.env.GODADDY_API_KEY
  const secret = apiSecret || process.env.GODADDY_API_SECRET

  if (!key || !secret) {
    console.warn('GoDaddy API credentials not configured')
    return null
  }

  if (!godaddyInstance) {
    godaddyInstance = new GoDaddyAPI({
      apiKey: key,
      apiSecret: secret,
      // 如果需要使用测试环境，可以设置为 'https://api.ote-godaddy.com'
      baseUrl: process.env.GODADDY_API_URL,
    })
  }

  return godaddyInstance
}
