#!/bin/bash

echo "🧹 清理 Next.js 缓存..."
rm -rf apps/web/.next
rm -rf apps/web/.turbo
rm -rf node_modules/.cache
rm -rf .turbo

echo "🔍 查找并结束残留的 Next.js 进程..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

echo "⏳ 等待端口释放..."
sleep 2

echo "🚀 启动开发服务器..."
pnpm dev