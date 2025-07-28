import OpenAI from 'openai'
import type { ProjectName } from '@smart-domain/types'

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

interface GenerateOptions {
  maxCount: number
  targetMarket: 'global' | 'china' | 'us' | 'eu'
}

export async function generateProjectNames(
  keywords: string[],
  semanticExtensions: Record<string, string[]>,
  options: GenerateOptions,
): Promise<ProjectName[]> {
  try {
    const prompt = `
基于以下关键词生成创意项目名：
关键词：${keywords.join(', ')}
语义扩展：${JSON.stringify(semanticExtensions, null, 2)}
目标市场：${options.targetMarket}

生成要求：
1. 生成 ${options.maxCount} 个创意项目名
2. 使用以下策略：
   - 直接组合（2-3个建议）：将关键词直接组合
   - 概念融合（2-3个建议）：融合概念创造新含义
   - 创造新词（2-3个建议）：创造易记的新词汇
   - 特色命名（2-3个建议）：${options.targetMarket === 'china' ? '中文特色命名' : '国际化命名'}

每个建议需包含：
- name: 项目名称
- nameType: 命名类型（direct_combination/concept_fusion/new_word/special_naming）
- reasoning: 创意来源和含义解释
- confidence: 品牌潜力评分(0.1-1.0)

请以JSON格式输出结果，包含suggestions数组：
{
  "suggestions": [
    {
      "name": "项目名称",
      "nameType": "命名类型",
      "reasoning": "创意解释",
      "confidence": 0.8
    }
  ]
}
`

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-3.5-turbo-1106', // 使用更快的模型
      messages: [
        {
          role: 'system',
          content:
            '你是一个创意命名专家，擅长创造独特、易记、有品牌价值的项目名称。请始终返回有效的JSON格式。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9,
      max_tokens: 1000, // 限制输出长度
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(response.choices[0].message.content || '[]')
    // 支持两种格式：直接数组或包含names字段的对象
    const names = Array.isArray(result)
      ? result
      : result.names || result.suggestions || []

    return names.map((item: any) => ({
      id: crypto.randomUUID(),
      name: item.name,
      nameType: item.nameType,
      confidence: item.confidence || 0.7,
      reasoning: item.reasoning,
    }))
  } catch (error) {
    console.error('Project Name Generation Error:', error)
    throw new Error('项目名生成失败')
  }
}
