# 🚀 生产环境部署检查清单

## 📋 部署前检查

### 环境变量配置

- [ ] `OPENAI_API_KEY` 已在平台设置
- [ ] `NODE_ENV=production` 已设置
- [ ] 移除或注释掉测试/调试代码
- [ ] API密钥有足够配额

### 安全检查

- [ ] `.env.local` 没有提交到git
- [ ] 生产API密钥与开发环境不同
- [ ] 没有console.log敏感信息
- [ ] API路由有适当的错误处理

### 性能优化

- [ ] 构建大小检查 (`pnpm build`)
- [ ] 没有未使用的依赖
- [ ] 图片优化（如果有）
- [ ] API响应时间测试

### 功能测试

- [ ] 本地生产构建测试 (`pnpm build && pnpm start`)
- [ ] API端点响应正常
- [ ] 错误处理工作正常
- [ ] 移动端响应式正常

## 🔧 生产环境变量设置

### Vercel 设置步骤

1. 登录 [vercel.com](https://vercel.com)
2. 选择项目 → Settings → Environment Variables
3. 添加以下变量：

```env
OPENAI_API_KEY = sk-proj-your-production-key
NODE_ENV = production
```

### 可选变量

```env
ANTHROPIC_API_KEY = sk-ant-your-key
GODADDY_API_KEY = your-godaddy-key  
GODADDY_API_SECRET = your-godaddy-secret
```

## 🚨 部署后验证

### 基础检查

- [ ] 网站可正常访问
- [ ] API健康检查：`GET /api/v1/generate`
- [ ] 首页加载正常
- [ ] 主题切换正常

### 重要功能测试

- [ ] 提交表单测试
- [ ] AI生成功能测试
- [ ] 错误处理测试
- [ ] 移动端测试

### 性能检查

- [ ] Lighthouse评分 > 90
- [ ] 首屏加载 < 3秒
- [ ] API响应 < 30秒
- [ ] 无控制台错误

## 🔍 故障排除

### 常见问题

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| API 500错误 | 环境变量未设置 | 检查平台环境变量 |
| 构建失败 | 依赖版本冲突 | 检查package.json |
| 加载缓慢 | 包大小过大 | 代码分割，移除未用依赖 |
| OpenAI错误 | API密钥或配额 | 验证密钥和账户余额 |

### 调试命令

```bash
# 查看环境变量（本地）
echo $OPENAI_API_KEY

# 查看构建输出
pnpm build --verbose

# 测试生产构建
pnpm build && pnpm start
```

## 📊 监控设置

### Vercel Analytics

- [ ] 启用 Vercel Analytics
- [ ] 设置性能预算
- [ ] 配置错误通知

### 手动监控

- [ ] 定期检查API配额使用
- [ ] 监控错误日志
- [ ] 性能指标跟踪

## 🔄 持续部署

### 自动部署设置

- [ ] GitHub集成已配置
- [ ] 分支保护规则（可选）
- [ ] 预览部署功能

### 发布流程

```bash
# 开发 → 测试 → 部署
git checkout main
git pull origin main
git merge feature-branch
git push origin main  # 自动触发部署
```
