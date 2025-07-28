# Google 登录配置指南

本项目使用 Supabase Auth 实现 Google 登录功能。请按照以下步骤配置：

## 1. 在 Google Cloud Console 配置 OAuth

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 在"凭据"页面创建 OAuth 2.0 客户端 ID
5. 设置授权重定向 URI：

   ```bash
   https://cyckxwagpdsswfwgcwrd.supabase.co/auth/v1/callback
   ```

   注意：这是你的 Supabase 项目 URL + `/auth/v1/callback`

## 2. 在 Supabase 配置 Google Provider

1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目
3. 进入 Authentication → Providers
4. 找到 Google 并启用
5. 填入从 Google Cloud Console 获取的：
   - Client ID
   - Client Secret
6. 保存配置

## 3. 配置重定向 URL

确保在你的应用中设置正确的重定向 URL：

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
})
```

## 4. 本地开发

本地开发时，需要在 Google Cloud Console 添加本地重定向 URI：

```bash
http://localhost:3000/auth/callback
```

## 5. 生产环境

部署到生产环境时，记得：

1. 在 Google Cloud Console 添加生产环境的重定向 URI
2. 更新环境变量中的 `NEXT_PUBLIC_API_URL`

## 常见问题

### 登录后重定向失败

- 检查 Google Cloud Console 中的重定向 URI 是否正确
- 确保 Supabase 项目 URL 正确

### 获取不到用户信息

- 确保在 Google OAuth 同意屏幕中勾选了必要的权限
- 检查 Supabase 的 auth.users 表中是否有用户数据

### 本地开发 HTTPS 问题

- Google OAuth 支持 localhost 的 HTTP，但生产环境必须使用 HTTPS
