#!/bin/bash

# 设置脚本在出错时退出
set -e

echo "🚀 Smart Domain Generator - 项目初始化"
echo "======================================"

# 检查 Node.js 版本
NODE_VERSION=$(node -v)
REQUIRED_NODE_VERSION="20.0.0"

echo "✅ 检查 Node.js 版本: $NODE_VERSION"

# 检查 pnpm 是否安装
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm 未安装，正在安装..."
    npm install -g pnpm
else
    echo "✅ pnpm 已安装"
fi

# 安装依赖
echo ""
echo "📦 安装项目依赖..."
pnpm install

# 复制环境变量文件
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 创建环境变量文件..."
    cp .env.example .env.local
    echo "⚠️  请编辑 .env.local 文件，添加您的 API 密钥"
fi

# 构建项目
echo ""
echo "🔨 构建项目..."
pnpm build

echo ""
echo "✅ 项目初始化完成！"
echo ""
echo "下一步："
echo "1. 编辑 .env.local 文件，添加您的 OpenAI API 密钥"
echo "2. 运行 'pnpm dev' 启动开发服务器"
echo "3. 访问 http://localhost:3000"