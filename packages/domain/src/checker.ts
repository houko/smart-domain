import type { DomainInfo } from '@smart-domain/types'
import { GoDaddyAPI } from './godaddy'

interface CheckOptions {
  includePricing: boolean
  godaddyApiKey?: string
  godaddyApiSecret?: string
  useGoDaddyAPI?: boolean
}

// 域名可用性检查必须使用域名注册商 API
// DNS 查询不能准确判断域名是否可以购买
// 批处理函数
async function processBatch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 5,
): Promise<R[]> {
  const results: R[] = []
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(processor))
    results.push(...batchResults)
  }
  return results
}

export async function checkDomainAvailability(
  projectName: string,
  tlds: string[],
  options: CheckOptions,
): Promise<DomainInfo[]> {
  // 初始化 GoDaddy API (如果提供了凭据)
  let godaddyAPI: GoDaddyAPI | null = null
  if (
    options.useGoDaddyAPI &&
    options.godaddyApiKey &&
    options.godaddyApiSecret
  ) {
    godaddyAPI = new GoDaddyAPI({
      apiKey: options.godaddyApiKey,
      apiSecret: options.godaddyApiSecret,
      baseUrl: process.env.GODADDY_API_URL, // 支持 OTE 环境
    })
  }
  // 生成域名变体
  const domainVariants = generateDomainVariants(projectName, tlds)

  // 使用批处理来限制并发数
  const results = await processBatch(
    domainVariants,
    async (domain) => {
      try {
        let isAvailable: boolean
        let price: number | undefined

        // 必须使用域名注册商 API 来准确检查域名可用性
        if (godaddyAPI) {
          try {
            console.log(`Checking ${domain} with GoDaddy API...`)
            const godaddyResult = await godaddyAPI.checkAvailability(domain)
            isAvailable = godaddyResult.available

            if (options.includePricing) {
              if (godaddyResult.price && godaddyResult.price > 0) {
                price = godaddyResult.price / 1000000 // GoDaddy 返回的价格是以微美分为单位
              } else {
                // 如果没有价格信息或价格为 0（OTE 环境），尝试获取 TLD 的建议价格
                const tld = domain.substring(domain.lastIndexOf('.'))
                try {
                  const suggestedPrice = await godaddyAPI.getSuggestedPrice(tld)
                  // 如果建议价格也是 0（OTE 环境常见），使用预设价格
                  price =
                    suggestedPrice > 0
                      ? suggestedPrice
                      : await getDomainPrice(domain)
                } catch (priceError) {
                  console.warn(`Failed to get price for ${tld}, using default`)
                  price = await getDomainPrice(domain)
                }
              }
            }
          } catch (apiError) {
            console.error(
              `GoDaddy API failed for ${domain}:`,
              apiError instanceof Error ? apiError.message : apiError,
            )
            // API 失败时，无法准确判断域名可用性
            return {
              domain,
              available: false,
              error: 'API check failed',
            }
          }
        } else {
          // 没有配置 API，无法准确检查域名可用性
          console.warn(`No domain registrar API configured for ${domain}`)
          return {
            domain,
            available: false,
            error: 'Domain check requires API configuration',
            message: '需要配置域名注册商 API（如 GoDaddy）才能检查域名可用性',
          }
        }

        return {
          domain,
          available: isAvailable,
          price,
          registrar: isAvailable
            ? godaddyAPI
              ? 'GoDaddy'
              : 'Namecheap'
            : undefined,
          purchaseUrl: isAvailable
            ? godaddyAPI
              ? `https://www.godaddy.com/domainsearch/find?domainToCheck=${domain}`
              : `https://www.namecheap.com/domains/registration/results/?domain=${domain}`
            : undefined,
        }
      } catch (error) {
        console.error(`Domain check error for ${domain}:`, error)
        return {
          domain,
          available: false,
          error: 'Check failed',
        }
      }
    },
    5, // 每批处理5个域名
  )

  return results
}

function generateDomainVariants(projectName: string, tlds: string[]): string[] {
  const baseName = projectName.toLowerCase().replace(/[^a-z0-9]/g, '')
  // 减少变体数量，只保留最重要的
  const variants = [baseName, `${baseName}app`, `get${baseName}`]

  const domains: string[] = []
  variants.forEach((variant) => {
    tlds.forEach((tld) => {
      domains.push(`${variant}${tld}`)
    })
  })

  return domains
}

// 获取域名价格（目前使用预设价格）
async function getDomainPrice(domain: string): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  const tld = domain.substring(domain.lastIndexOf('.'))
  const basePrices: Record<string, number> = {
    '.com': 12.99,
    '.net': 11.99,
    '.org': 10.99,
    '.io': 39.99,
    '.app': 19.99,
  }

  return basePrices[tld] || 15.99
}
