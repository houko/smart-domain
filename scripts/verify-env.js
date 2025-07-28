#!/usr/bin/env node

/**
 * 环境变量验证脚本
 * 运行: node scripts/verify-env.js
 */

// 加载环境变量文件
const path = require('path')
const fs = require('fs')

// 尝试从多个位置加载环境变量
const envFiles = [
  path.join(process.cwd(), 'apps/web/.env.local'),
  path.join(process.cwd(), '.env.local'),
  path.join(process.cwd(), '.env'),
]

for (const envFile of envFiles) {
  if (fs.existsSync(envFile)) {
    console.log(`📁 找到环境变量文件: ${envFile}`)
    const envContent = fs.readFileSync(envFile, 'utf8')
    const lines = envContent.split('\n')

    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=')
        if (key && values.length > 0) {
          process.env[key] = values.join('=')
        }
      }
    }
    break
  }
}

const requiredEnvVars = ['OPENAI_API_KEY']

const optionalEnvVars = [
  'ANTHROPIC_API_KEY',
  'GODADDY_API_KEY',
  'GODADDY_API_SECRET',
  'NODE_ENV',
]

async function verifyOpenAIKey(apiKey) {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    return response.ok
  } catch (error) {
    return false
  }
}

async function main() {
  console.log('🔍 验证环境变量设置...\n')

  let allValid = true

  // 检查必需的环境变量
  console.log('📋 必需变量:')
  for (const varName of requiredEnvVars) {
    const value = process.env[varName]
    if (value) {
      console.log(`  ✅ ${varName}: 已设置`)

      // 特殊验证OpenAI API密钥
      if (varName === 'OPENAI_API_KEY') {
        console.log('  🔄 验证OpenAI API密钥...')
        const isValid = await verifyOpenAIKey(value)
        if (isValid) {
          console.log('  ✅ OpenAI API密钥有效')
        } else {
          console.log('  ❌ OpenAI API密钥无效或网络错误')
          allValid = false
        }
      }
    } else {
      console.log(`  ❌ ${varName}: 未设置`)
      allValid = false
    }
  }

  // 检查可选的环境变量
  console.log('\n📋 可选变量:')
  for (const varName of optionalEnvVars) {
    const value = process.env[varName]
    if (value) {
      console.log(`  ✅ ${varName}: 已设置`)
    } else {
      console.log(`  ⚪ ${varName}: 未设置（可选）`)
    }
  }

  // 环境检查
  console.log('\n🌍 环境信息:')
  console.log(`  📦 Node.js: ${process.version}`)
  console.log(`  🔧 NODE_ENV: ${process.env.NODE_ENV || '未设置'}`)
  console.log(`  🌐 平台: ${process.env.VERCEL ? 'Vercel' : '本地'}`)

  // 总结
  console.log('\n' + '='.repeat(50))
  if (allValid) {
    console.log('✅ 所有必需的环境变量都已正确设置！')
    console.log('🚀 可以安全部署到生产环境')
  } else {
    console.log('❌ 存在缺失或无效的环境变量')
    console.log('🔧 请检查上述错误并修复后重试')
    process.exit(1)
  }
}

main().catch(console.error)
