# Open Graph 图片设计规范

## 图片规格

- **尺寸**: 1200x630px
- **格式**: PNG 或 JPG
- **文件大小**: 建议小于 1MB
- **命名**: og-image.png

## 设计要求

### 主图片 (og-image.png)

用于网站首页和默认分享

**内容元素**:

1. **Logo**: Smart Domain Generator logo (居中或左上角)
2. **标题**: "智能域名生成器"
3. **副标题**: "AI驱动的项目命名和域名建议系统"
4. **视觉元素**:
   - 渐变背景 (紫色到蓝色，与品牌色一致)
   - 域名相关的图标或插图
   - 现代、科技感的设计风格

**配色方案**:

- 主色: #8B5CF6 (紫色) 到 #3B82F6 (蓝色) 渐变
- 文字: 白色或深灰色
- 背景: 浅灰色或白色底纹

### 其他建议图片

1. **og-image-zh.png** - 中文版本
2. **og-image-en.png** - 英文版本
3. **og-image-api.png** - API文档专用
4. **og-image-help.png** - 帮助中心专用

## 文件位置

所有 Open Graph 图片应放置在:

```bash
/apps/web/public/
```

## 使用方式

在页面的 metadata 中引用:

```typescript
export const metadata = generateSEOMetadata({
  // ... 其他配置
  images: ['/og-image.png'],
})
```

## 测试工具

创建图片后，使用以下工具测试效果:

- Facebook Sharing Debugger: <https://developers.facebook.com/tools/debug/>
- Twitter Card Validator: <https://cards-dev.twitter.com/validator>
- LinkedIn Post Inspector: <https://www.linkedin.com/post-inspector/>

## 注意事项

1. 确保图片在各种背景下都清晰可见
2. 文字要足够大，在缩略图中也能阅读
3. 避免在边缘放置重要内容（可能被裁剪）
4. 使用高对比度确保可读性
5. 考虑深色模式下的显示效果
