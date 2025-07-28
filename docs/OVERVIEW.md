# Smart Domain Generator - 项目概览

## 项目简介

智能域名生成器是一个基于 AI 的 Web 应用，帮助用户通过自然语言描述获得创意项目名称和可用域名建议。

## 核心功能

### 1. 智能分析

- 自然语言理解
- 关键词提取
- 语义扩展

### 2. 创意生成

- 多策略命名方案
- 品牌潜力评分
- 中英文支持

### 3. 域名查询

- 实时可用性检查
- 价格对比
- 一键购买链接

## 技术亮点

- **AI 集成**: OpenAI GPT-4 驱动的智能分析
- **现代架构**: Next.js 14 App Router + API Routes
- **优雅 UI**: Shadcn/ui + Tailwind CSS
- **性能优化**: Redis 缓存 + 并发查询
- **开发体验**: TypeScript + Biome + Turborepo

## 使用流程

```text
用户输入描述 → AI 分析关键词 → 生成项目名 → 查询域名 → 展示结果
```

## 项目结构

```bash
smart-domain/
├── apps/web/              # Next.js 主应用
│   ├── src/app/          # 页面和 API 路由
│   ├── src/components/   # React 组件
│   └── src/lib/          # 业务逻辑
├── packages/             # 共享包
│   ├── types/           # TypeScript 类型
│   ├── db/              # 数据库和缓存
│   └── ai/              # AI 相关配置
└── 配置文件              # 项目配置
```

## 快速开始

1. 克隆项目并安装依赖
2. 配置 OpenAI API Key
3. 运行 `pnpm dev`
4. 访问 <http://localhost:3000>

就这么简单！
