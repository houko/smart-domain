// 通用类型
export type Language = 'zh' | 'en'
export type TargetMarket = 'global' | 'china' | 'us' | 'eu'

// 域名相关类型
export interface DomainContext {
  businessType: string
  targetAudience: string
  coreValue: string
}

// NLP 分析相关
export interface Keyword {
  word: string
  weight: number
}

export interface SemanticWord {
  original: string
  extension: string
  similarity: number
}

export interface AnalysisResult {
  inputId: string
  keywords: string[]
  semanticExtensions: Record<string, string[]>
  domainContext: DomainContext
}

// 项目名生成相关
export type NameType =
  | 'direct_combination'
  | 'concept_fusion'
  | 'new_word'
  | 'special_naming'

export interface ProjectName {
  id: string
  name: string
  nameType: NameType
  confidence: number
  reasoning: string
}

// 域名查询相关
export interface DomainInfo {
  domain: string
  available: boolean
  price?: number
  registrar?: string
  purchaseUrl?: string
  error?: string
  message?: string
}

export interface DomainSuggestion extends ProjectName {
  domains: DomainInfo[]
  availableDomainCount: number
  bestDomain?: DomainInfo
}

// API 相关
export interface GenerateOptions {
  maxSuggestions?: number
  includePricing?: boolean
  targetMarket?: TargetMarket
  preferredTlds?: string[]
}

export interface GenerateRequest {
  description: string
  options?: GenerateOptions
}

export interface GenerateResponse {
  success: boolean
  data?: {
    query: string
    analysis: {
      keywords: string[]
      semanticExtensions: Record<string, string[]>
    }
    suggestions: DomainSuggestion[]
    generatedAt: string
  }
  error?: {
    code: string
    message: string
    details?: any
  }
}
