import {
  FAQStructuredData,
  SoftwareApplicationStructuredData,
  WebApplicationStructuredData,
} from '@/components/seo/structured-data'
import {
  generateMetadata as generateSEOMetadata,
  generateViewport,
} from '@/lib/seo'
import { DomainGeneratorWrapper } from './domain-generator-wrapper'

export const metadata = generateSEOMetadata({
  title: '起名助手 - 为你的项目起个好名字',
  description:
    '简单描述你的想法，我们帮你想出合适的项目名称和域名。让起名变得简单有趣。',
  keywords: [
    '项目起名',
    '域名起名',
    '起名助手',
    '项目命名',
    '域名查询',
    '起名建议',
    '域名可用性',
    '品牌命名',
    '创业起名',
    '网站起名',
  ],
  canonical: '/',
  type: 'website',
  images: ['/og-image.png'],
})

export const viewport = generateViewport()

export default function HomePage() {
  return (
    <>
      <WebApplicationStructuredData />
      <SoftwareApplicationStructuredData />
      <FAQStructuredData />
      <DomainGeneratorWrapper />
    </>
  )
}
