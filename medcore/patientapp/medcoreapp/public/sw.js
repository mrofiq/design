// MedCore Patient App Service Worker
// Provides offline capability and caching for medical appointment data

const CACHE_NAME = 'medcore-patient-v1.0.0'
const STATIC_CACHE = 'medcore-static-v1.0.0'
const DYNAMIC_CACHE = 'medcore-dynamic-v1.0.0'

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/id',
  '/en',
  '/offline',
  '/manifest.json',
  // Add other essential static assets
]

// API endpoints that should be cached
const CACHEABLE_APIS = [
  '/api/doctors',
  '/api/appointments',
  '/api/user/profile',
  '/api/specializations'
]

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...')

  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[ServiceWorker] Caching static files')
      return cache.addAll(STATIC_FILES)
    }).then(() => {
      console.log('[ServiceWorker] Static files cached successfully')
      return self.skipWaiting()
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...')

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME &&
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('[ServiceWorker] Cache cleanup completed')
      return self.clients.claim()
    })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return
  }

  // Handle different types of requests with appropriate strategies
  if (isStaticAsset(request)) {
    // Cache First strategy for static assets
    event.respondWith(cacheFirst(request))
  } else if (isAPIRequest(request)) {
    // Network First strategy for API requests with offline fallback
    event.respondWith(networkFirstWithFallback(request))
  } else if (isNavigationRequest(request)) {
    // Network First strategy for navigation with offline page fallback
    event.respondWith(networkFirstForNavigation(request))
  } else {
    // Default to Network First
    event.respondWith(networkFirst(request))
  }
})

// Background sync for offline appointment bookings
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync:', event.tag)

  if (event.tag === 'appointment-booking') {
    event.waitUntil(syncAppointmentBookings())
  } else if (event.tag === 'user-preferences') {
    event.waitUntil(syncUserPreferences())
  }
})

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received:', event)

  const options = {
    body: event.data ? event.data.text() : 'New notification from MedCore',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'medcore-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/view-action.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-action.png'
      }
    ]
  }

  if (event.data) {
    const data = event.data.json()
    options.body = data.message
    options.data = data

    // Customize notification based on type
    if (data.type === 'appointment-reminder') {
      options.title = 'Appointment Reminder'
      options.tag = 'appointment-reminder'
    } else if (data.type === 'journey-update') {
      options.title = 'Journey Update'
      options.tag = 'journey-update'
    } else {
      options.title = 'MedCore'
    }
  }

  event.waitUntil(
    self.registration.showNotification('MedCore', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked:', event)

  event.notification.close()

  const { action, data } = event
  let url = '/'

  if (data) {
    if (data.type === 'appointment-reminder' && data.appointmentId) {
      url = `/appointments/${data.appointmentId}`
    } else if (data.type === 'journey-update' && data.appointmentId) {
      url = `/journey/${data.appointmentId}`
    } else if (data.url) {
      url = data.url
    }
  }

  if (action === 'view') {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Check if app is already open
        const client = clientList.find((c) => c.url.includes(url))
        if (client) {
          return client.focus()
        }

        // Open new window/tab
        if (clients.openWindow) {
          return clients.openWindow(url)
        }
      })
    )
  }
})

// Helper functions

function isStaticAsset(request) {
  const url = new URL(request.url)
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)
}

function isAPIRequest(request) {
  const url = new URL(request.url)
  return url.pathname.startsWith('/api/') ||
         CACHEABLE_APIS.some(api => url.pathname.startsWith(api))
}

function isNavigationRequest(request) {
  return request.mode === 'navigate'
}

// Cache First strategy
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.error('[ServiceWorker] Cache first failed:', error)
    return new Response('Offline content not available', { status: 503 })
  }
}

// Network First strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log('[ServiceWorker] Network failed, trying cache:', error)
    const cachedResponse = await caches.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    throw error
  }
}

// Network First with fallback for API requests
async function networkFirstWithFallback(request) {
  try {
    return await networkFirst(request)
  } catch (error) {
    console.log('[ServiceWorker] API request failed, providing fallback')

    // Provide appropriate fallback based on the API endpoint
    const url = new URL(request.url)

    if (url.pathname.includes('/appointments')) {
      return new Response(JSON.stringify({
        appointments: [],
        offline: true,
        message: 'Appointments will be synced when connection is restored'
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (url.pathname.includes('/doctors')) {
      return new Response(JSON.stringify({
        doctors: [],
        offline: true,
        message: 'Doctor list will be updated when connection is restored'
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response('Service temporarily unavailable', { status: 503 })
  }
}

// Network First for navigation with offline page fallback
async function networkFirstForNavigation(request) {
  try {
    return await networkFirst(request)
  } catch (error) {
    console.log('[ServiceWorker] Navigation failed, showing offline page')

    const offlineResponse = await caches.match('/offline')
    if (offlineResponse) {
      return offlineResponse
    }

    // Fallback offline page
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>MedCore - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              text-align: center;
              padding: 2rem;
              background: #FAFBFC;
              color: #1A1A2E;
            }
            .container { max-width: 400px; margin: 0 auto; }
            .icon { font-size: 4rem; margin-bottom: 1rem; }
            h1 { color: #0066FF; margin-bottom: 1rem; }
            p { margin-bottom: 1.5rem; line-height: 1.6; }
            .retry-btn {
              background: #0066FF;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-size: 16px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">🏥</div>
            <h1>You're Offline</h1>
            <p>It looks like you're not connected to the internet. Some features may not be available, but you can still view your cached appointments and doctor information.</p>
            <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

// Background sync functions
async function syncAppointmentBookings() {
  console.log('[ServiceWorker] Syncing appointment bookings...')

  // Get pending appointment bookings from IndexedDB
  // This would be implemented with IndexedDB operations
  // For now, we'll just log the sync attempt

  try {
    // Implementation would go here
    console.log('[ServiceWorker] Appointment bookings synced successfully')
  } catch (error) {
    console.error('[ServiceWorker] Failed to sync appointment bookings:', error)
    throw error
  }
}

async function syncUserPreferences() {
  console.log('[ServiceWorker] Syncing user preferences...')

  try {
    // Implementation would go here
    console.log('[ServiceWorker] User preferences synced successfully')
  } catch (error) {
    console.error('[ServiceWorker] Failed to sync user preferences:', error)
    throw error
  }
}

// Cleanup old cache entries periodically
function cleanupOldCacheEntries() {
  const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days
  const now = Date.now()

  caches.open(DYNAMIC_CACHE).then((cache) => {
    cache.keys().then((requests) => {
      requests.forEach((request) => {
        cache.match(request).then((response) => {
          if (response) {
            const dateHeader = response.headers.get('date')
            if (dateHeader) {
              const responseDate = new Date(dateHeader).getTime()
              if (now - responseDate > maxAge) {
                cache.delete(request)
              }
            }
          }
        })
      })
    })
  })
}

// Run cleanup every hour
setInterval(cleanupOldCacheEntries, 60 * 60 * 1000)