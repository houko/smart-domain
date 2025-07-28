# 🚀 部署指南

## Vercel 部署步骤

### 1. 准备工作

确保项目可以本地构建：

```bash
pnpm build
```

### 2. 环境变量设置

在Vercel控制台设置以下环境变量：

**必需变量：**

- `OPENAI_API_KEY`: 您的OpenAI API密钥
- `NODE_VERSION`: 20

**可选变量：**

- `ANTHROPIC_API_KEY`: Anthropic API密钥（如果需要）
- `GODADDY_API_KEY`: GoDaddy API密钥（真实域名查询）
- `GODADDY_API_SECRET`: GoDaddy API秘钥

### 3. 部署方式

#### 方式1：GitHub集成（推荐）

1. 将代码推送到GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 导入GitHub仓库
4. Vercel会自动识别Next.js项目
5. 设置环境变量
6. 部署！

#### 方式2：Vercel CLI

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

### 4. 部署后配置

- **自定义域名**：在Vercel控制台配置
- **分析监控**：启用Vercel Analytics
- **性能优化**：启用Edge Functions

## 其他平台部署

### Netlify

```toml
# netlify.toml
[build]
  base = "/"
  command = "pnpm build --filter @smart-domain/web"
  publish = "apps/web/.next"

[build.environment]
  NODE_VERSION = "20"
  PNPM_FLAGS = "--shamefully-hoist"
```

### Railway

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY . .

RUN npm install -g pnpm@10.13.1
RUN pnpm install
RUN pnpm build --filter=@smart-domain/web

EXPOSE 3000
CMD ["pnpm", "start", "--filter=@smart-domain/web"]
```

## 部署检查清单

- [ ] 环境变量已设置
- [ ] 本地构建成功
- [ ] API端点可访问
- [ ] OpenAI API正常工作
- [ ] 响应式设计正常
- [ ] 错误处理正常

## 性能优化建议

1. **启用缓存**：API响应缓存
2. **图片优化**：Next.js Image组件
3. **代码分割**：动态导入大型组件
4. **CDN加速**：Vercel自动提供
5. **监控**：启用Vercel Analytics

## 故障排除

### 构建失败

- 检查Node.js版本
- 检查pnpm版本
- 检查依赖冲突

### API错误

- 验证环境变量
- 检查OpenAI API配额
- 查看函数日志

### 性能问题

- 启用缓存
- 优化API调用
- 减少包大小
