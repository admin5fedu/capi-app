const CACHE_NAME = 'capi-consulting-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.error('Cache install failed:', error)
      })
  )
  // Force the waiting service worker to become the active service worker
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  // Take control of all pages immediately
  return self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  
  // Skip service worker for Vite dev server (localhost with port)
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    // In development, just fetch from network - don't intercept
    return
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }
  
  // Skip WebSocket and other non-http requests
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response
        }
        
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses or opaque responses
            if (!response || response.status !== 200 || response.type === 'opaque') {
              return response
            }

            // Clone the response
            const responseToCache = response.clone()

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })
              .catch((error) => {
                console.error('Cache put failed:', error)
              })

            return response
          })
          .catch((error) => {
            console.error('Fetch failed:', error)
            // If fetch fails and it's a document request, return cached index.html
            if (event.request.destination === 'document') {
              return caches.match('/index.html')
            }
            // For other requests, return a proper error response
            return new Response('Network error', {
              status: 408,
              statusText: 'Request Timeout'
            })
          })
      })
      .catch((error) => {
        console.error('Cache match failed:', error)
        // Fallback to network
        return fetch(event.request).catch(() => {
          return new Response('Service unavailable', {
            status: 503,
            statusText: 'Service Unavailable'
          })
        })
      })
  )
})
