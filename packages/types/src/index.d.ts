export type Language = 'zh' | 'en'
export type TargetMarket = 'global' | 'china' | 'us' | 'eu'
export interface DomainContext {
  businessType: string
  targetAudience: string
  coreValue: string
}
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
export interface DomainInfo {
  domain: string
  available: boolean
  price?: number
  registrar?: string
  purchaseUrl?: string
  error?: string
}
export interface DomainSuggestion extends ProjectName {
  domains: DomainInfo[]
  availableDomainCount: number
  bestDomain?: DomainInfo
}
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
//# sourceMappingURL=index.d.ts.map
