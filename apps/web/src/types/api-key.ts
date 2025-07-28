export interface ApiKey {
  id: string
  user_id: string
  name: string
  key_prefix: string
  description?: string
  last_used_at?: string
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface ApiKeyUsage {
  id: string
  api_key_id: string
  endpoint: string
  method: string
  status_code?: number
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface CreateApiKeyInput {
  name: string
  description?: string
  expires_at?: string
}
