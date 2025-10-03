/**
 * Service Worker for Developer Report Dashboard
 * Provides offline functionality and caching
 */

const CACHE_NAME = 'devreport-v1.0.0';
const RUNTIME_CACHE = 'devreport-runtime-v1';

// Files to cache on install
const STATIC_ASSETS = [
  '/',
  '/index-optimized.html',
  '/login.html',
  '/manifest.json',

  // CSS
  '/css/design-tokens.css',
  '/css/base.css',
  '/css/layout.css',
  '/css/utilities.css',
  '/css/auth.css',
  '/css/components/buttons.css',
  '/css/components/cards.css',
  '/css/components/forms.css',
  '/css/components/modals.css',
  '/css/components/toasts.css',
  '/css/components/tabs.css',
  '/css/components/tables.css',
  '/css/components/badges.css',
  '/css/components/avatars.css',
  '/css/components/progress.css',
  '/css/components/header.css',
  '/css/components/navigation.css',
  '/css/components/timeline.css',
  '/css/components/achievements.css',
  '/css/components/leaderboard.css',
  '/css/components/report-form.css',
  '/css/pages/login.css',
  '/css/pages/dashboard.css',
  '/css/pages/developer-dashboard.css',

  // JavaScript
  '/js/app.js',
  '/js/router.js',
  '/js/routes.js',
  '/js/auth.js',
  '/js/components/Toast.js',
  '/js/components/Modal.js',
  '/js/components/Button.js',
  '/js/components/Card.js',
  '/js/components/Form.js',
  '/js/components/Tabs.js',
  '/js/components/Timeline.js',
  '/js/components/Header.js',
  '/js/components/Navigation.js',
  '/js/components/ReportForm.js',
  '/js/components/Achievements.js',
  '/js/components/Leaderboard.js',
  '/js/layout/AppShell.js',
  '/js/pages/LoginPage.js',
  '/js/pages/DeveloperDashboard.js',
  '/js/utils/performance.js',
  '/js/utils/animations.js',
];

/**
 * Install Event
 * Caches static assets
 */
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting');
        return self.skipWaiting();
      })
  );
});

/**
 * Activate Event
 * Cleans up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
            })
            .map((cacheName) => {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Claiming clients');
        return self.clients.claim();
      })
  );
});

/**
 * Fetch Event
 * Implements caching strategy
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip Chrome extension requests
  if (request.url.includes('chrome-extension://')) {
    return;
  }

  // API requests - Network first, cache fallback
  if (request.url.includes('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Static assets - Cache first, network fallback
  event.respondWith(cacheFirstStrategy(request));
});

/**
 * Cache First Strategy
 * Try cache first, fall back to network
 */
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[ServiceWorker] Fetch error:', error);

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/index-optimized.html');
    }

    throw error;
  }
}

/**
 * Network First Strategy
 * Try network first, fall back to cache
 */
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[ServiceWorker] Network error, trying cache:', error);

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

/**
 * Message Event
 * Handle messages from clients
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls || [];
    caches.open(RUNTIME_CACHE).then((cache) => {
      cache.addAll(urls);
    });
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    });
  }
});

/**
 * Background Sync Event
 * Handle background sync (for offline form submissions)
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reports') {
    event.waitUntil(syncReports());
  }
});

async function syncReports() {
  // Get pending reports from IndexedDB
  // Send to server
  // Clear from IndexedDB on success
  console.log('[ServiceWorker] Syncing reports...');
}

/**
 * Push Event
 * Handle push notifications
 */
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/assets/icon-192.png',
    badge: '/assets/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Developer Report Dashboard', options)
  );
});

/**
 * Notification Click Event
 * Handle notification clicks
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});
