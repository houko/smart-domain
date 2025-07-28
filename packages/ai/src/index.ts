// AI 相关的共享逻辑
export * from './nlp'
export * from './creativity'

export const AI_MODELS = {
  GPT4: 'gpt-4-turbo-preview',
  GPT35: 'gpt-3.5-turbo',
  CLAUDE3: 'claude-3-opus-20240229',
} as const

export type AIModel = (typeof AI_MODELS)[keyof typeof AI_MODELS]

// Prompt 模板
export const PROMPTS = {
  ANALYZE_TEXT: `
分析以下用户描述，提取核心关键词并进行语义扩展：
"{description}"

要求：
1. 识别核心业务概念
2. 提取目标用户群体
3. 识别产品类型
4. 对每个关键词进行语义扩展，提供相关的英文词汇

输出 JSON 格式。
`,

  GENERATE_NAMES: `
基于以下关键词生成创意项目名：
关键词：{keywords}
语义扩展：{extensions}
目标市场：{market}

生成要求：
1. 生成 {count} 个创意项目名
2. 使用多种命名策略
3. 每个建议需包含名称、类型、解释和评分

输出 JSON 格式。
`,
} as const
