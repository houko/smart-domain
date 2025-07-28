#!/bin/bash

# Vercel 环境变量设置脚本
# 使用前请先安装 Vercel CLI: npm i -g vercel

echo "🔧 设置 Vercel 环境变量..."

# 检查是否已登录 Vercel
if ! vercel whoami > /dev/null 2>&1; then
    echo "请先登录 Vercel: vercel login"
    exit 1
fi

# 设置生产环境变量
echo "设置 OPENAI_API_KEY..."
vercel env add OPENAI_API_KEY production

echo "设置 NODE_ENV..."
vercel env add NODE_ENV production <<< "production"

# 可选：设置其他环境变量
echo "是否设置 ANTHROPIC_API_KEY? (y/n)"
read -r setup_anthropic
if [ "$setup_anthropic" = "y" ]; then
    vercel env add ANTHROPIC_API_KEY production
fi

echo "是否设置 GoDaddy API 密钥? (y/n)"
read -r setup_godaddy
if [ "$setup_godaddy" = "y" ]; then
    vercel env add GODADDY_API_KEY production
    vercel env add GODADDY_API_SECRET production
fi

echo "✅ 环境变量设置完成！"
echo "🚀 现在可以重新部署项目了: vercel --prod"