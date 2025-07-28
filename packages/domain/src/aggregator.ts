import type { ProjectName, DomainInfo } from '@smart-domain/types'

interface ProjectWithDomains extends ProjectName {
  domains: DomainInfo[]
}

export function aggregateResults(results: ProjectWithDomains[]) {
  // 按照可用域名数量和置信度排序
  return results
    .map((result) => ({
      ...result,
      availableDomainCount: result.domains.filter((d) => d.available).length,
      bestDomain: result.domains
        .filter((d) => d.available)
        .sort((a, b) => {
          // 优先 .com，然后按价格排序
          if (a.domain.endsWith('.com') && !b.domain.endsWith('.com')) return -1
          if (!a.domain.endsWith('.com') && b.domain.endsWith('.com')) return 1
          return (a.price || 999) - (b.price || 999)
        })[0],
    }))
    .sort((a, b) => {
      // 先按可用域名数量排序，再按置信度排序
      if (a.availableDomainCount !== b.availableDomainCount) {
        return b.availableDomainCount - a.availableDomainCount
      }
      return b.confidence - a.confidence
    })
}
