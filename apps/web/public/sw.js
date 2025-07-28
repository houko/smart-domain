// Service Worker for Smart Domain Generator PWA
// Version 3: Fixed redirect caching issues
const CACHE_NAME = 'smart-domain-v3'
const urlsToCache = ['/', '/manifest.json', '/favicon.ico', '/favicon.svg']

// 安装事件
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache')
      return cache.addAll(urlsToCache)
    }),
  )
})

// 获取事件
self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)

  // 只处理 http 和 https 请求
  if (!url.protocol.startsWith('http')) {
    return
  }

  // 只缓存 GET 请求
  if (request.method !== 'GET') {
    return
  }

  // 不缓存 API 请求
  if (url.pathname.startsWith('/api/')) {
    return
  }

  // 不缓存认证相关的请求
  if (url.pathname.startsWith('/auth/')) {
    return
  }

  event.respondWith(
    caches.match(request).then((response) => {
      // 缓存中找到了返回缓存
      if (response) {
        return response
      }

      return fetch(request).then((response) => {
        // 检查是否是有效的响应
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // 不缓存重定向响应
        if (response.redirected || (response.status >= 300 && response.status < 400)) {
          return response
        }

        // 不缓存跨域请求
        if (url.origin !== self.location.origin) {
          return response
        }

        // 克隆响应，因为流只能使用一次
        const responseToCache = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache)
        })

        return response
      })
    }),
  )
})

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
