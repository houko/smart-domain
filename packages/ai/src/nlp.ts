import OpenAI from 'openai'
import type { AnalysisResult } from '@smart-domain/types'

let openai: OpenAI | null = null

function getOpenAI(): OpenAI {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required')
    }
    // 去除环境变量中可能存在的换行符和空格
    const apiKey = process.env.OPENAI_API_KEY.trim()
    openai = new OpenAI({
      apiKey: apiKey,
    })
  }
  return openai
}

export async function analyzeText(
  description: string,
): Promise<AnalysisResult> {
  try {
    const prompt = `
分析以下用户描述，提取核心关键词并进行语义扩展：
"${description}"

要求：
1. 识别核心业务概念
2. 提取目标用户群体
3. 识别产品类型
4. 对每个关键词进行语义扩展，提供相关的英文词汇

请以JSON格式输出分析结果：
{
  "keywords": ["关键词1", "关键词2", ...],
  "semanticExtensions": {
    "关键词1": ["扩展词1", "扩展词2", ...],
    "关键词2": ["扩展词3", "扩展词4", ...]
  },
  "domainContext": {
    "businessType": "社交/工具/电商/...",
    "targetAudience": "目标用户描述",
    "coreValue": "核心价值主张"
  }
}
`

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-3.5-turbo-1106', // 使用更快的模型
      messages: [
        {
          role: 'system',
          content:
            '你是一个专业的产品命名和品牌策略专家，擅长分析用户需求并提取关键概念。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800, // 限制输出长度
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')

    return {
      inputId: crypto.randomUUID(),
      keywords: result.keywords || [],
      semanticExtensions: result.semanticExtensions || {},
      domainContext: result.domainContext || {
        businessType: 'unknown',
        targetAudience: 'unknown',
        coreValue: 'unknown',
      },
    }
  } catch (error) {
    console.error('NLP Analysis Error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      apiKey: process.env.OPENAI_API_KEY ? '已设置' : '未设置',
      type: typeof error,
    })
    throw new Error(
      `文本分析失败: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
