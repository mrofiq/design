/**
 * DevDash Service Worker
 * Provides offline functionality, caching, and performance optimization
 */

const CACHE_NAME = 'devdash-v1.0.0';
const STATIC_CACHE_NAME = 'devdash-static-v1.0.0';
const DATA_CACHE_NAME = 'devdash-data-v1.0.0';

// Resources to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/config.js',
    '/assets/css/dashboard.css',
    '/assets/js/dashboard.js',
    '/assets/js/navigation.js',
    '/assets/js/charts.js',
    '/components/team-dashboard.html',
    // External CDN resources
    'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// API endpoints that should be cached
const CACHE_API_PATTERNS = [
    /\/api\/v1\/dashboard\/metrics/,
    /\/api\/v1\/integrations\//,
    /\/api\/v1\/reports\/daily/,
    /\/api\/v1\/team\//
];

// API endpoints that should not be cached (real-time data)
const NO_CACHE_API_PATTERNS = [
    /\/api\/v1\/auth\//,
    /\/api\/v1\/notifications\//,
    /\/api\/v1\/realtime\//
];

/**
 * Service Worker Installation
 * Cache static assets for offline access
 */
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    
    event.waitUntil(
        Promise.all([
            // Cache static files
            caches.open(STATIC_CACHE_NAME).then((cache) => {
                console.log('[SW] Caching static files');
                return cache.addAll(STATIC_FILES);
            }),
            
            // Skip waiting to activate immediately
            self.skipWaiting()
        ])
    );
});

/**
 * Service Worker Activation
 * Clean up old caches and claim clients
 */
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE_NAME && 
                            cacheName !== DATA_CACHE_NAME &&
                            cacheName.startsWith('devdash-')) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // Claim all clients
            self.clients.claim()
        ])
    );
});

/**
 * Fetch Event Handler
 * Implement caching strategies based on request type
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-HTTP requests
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Handle different types of requests
    if (request.url.includes('/api/')) {
        event.respondWith(handleApiRequest(request));
    } else {
        event.respondWith(handleStaticRequest(request));
    }
});

/**
 * Handle API Requests
 * Implement network-first strategy with fallback
 */
async function handleApiRequest(request) {
    const url = new URL(request.url);
    
    // Check if API should not be cached
    if (NO_CACHE_API_PATTERNS.some(pattern => pattern.test(url.pathname))) {
        return handleNetworkOnly(request);
    }
    
    // Check if API should be cached
    if (CACHE_API_PATTERNS.some(pattern => pattern.test(url.pathname))) {
        return handleNetworkFirst(request, DATA_CACHE_NAME);
    }
    
    // Default to network-only for other API requests
    return handleNetworkOnly(request);
}

/**
 * Handle Static Asset Requests
 * Implement cache-first strategy for static assets
 */
async function handleStaticRequest(request) {
    return handleCacheFirst(request, STATIC_CACHE_NAME);
}

/**
 * Network-First Strategy
 * Try network first, fallback to cache
 */
async function handleNetworkFirst(request, cacheName) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        // If successful, update cache and return response
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            // Clone response before caching (response can only be read once)
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        throw new Error('Network response not ok');
    } catch (error) {
        console.log('[SW] Network failed, trying cache:', request.url);
        
        // Fallback to cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // If no cache, return offline page or error response
        return createOfflineResponse(request);
    }
}

/**
 * Cache-First Strategy
 * Try cache first, fallback to network
 */
async function handleCacheFirst(request, cacheName) {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Fallback to network
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed for:', request.url);
        return createOfflineResponse(request);
    }
}

/**
 * Network-Only Strategy
 * Always go to network, no caching
 */
async function handleNetworkOnly(request) {
    try {
        return await fetch(request);
    } catch (error) {
        console.log('[SW] Network-only request failed:', request.url);
        return createOfflineResponse(request);
    }
}

/**
 * Create Offline Response
 * Return appropriate offline response based on request type
 */
function createOfflineResponse(request) {
    const url = new URL(request.url);
    
    // For HTML requests, return offline page
    if (request.headers.get('Accept')?.includes('text/html')) {
        return new Response(
            createOfflineHTML(),
            {
                status: 200,
                statusText: 'OK',
                headers: { 'Content-Type': 'text/html' }
            }
        );
    }
    
    // For API requests, return JSON error
    if (url.pathname.includes('/api/')) {
        return new Response(
            JSON.stringify({
                error: 'Offline',
                message: 'You are currently offline. Some features may not be available.',
                timestamp: Date.now()
            }),
            {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
    
    // For other requests, return generic offline response
    return new Response(
        'You are currently offline',
        {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
        }
    );
}

/**
 * Create Offline HTML Page
 * Basic offline page when main app is not cached
 */
function createOfflineHTML() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>DevDash - Offline</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    background: #f9fafb;
                    color: #374151;
                }
                .offline-container {
                    text-align: center;
                    max-width: 400px;
                    padding: 2rem;
                }
                .offline-icon {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 2rem;
                    background: #ef4444;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 2rem;
                }
                h1 {
                    margin: 0 0 1rem;
                    font-size: 1.5rem;
                    font-weight: 600;
                }
                p {
                    margin: 0 0 2rem;
                    line-height: 1.6;
                    color: #6b7280;
                }
                button {
                    background: #2563eb;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                button:hover {
                    background: #1d4ed8;
                }
            </style>
        </head>
        <body>
            <div class="offline-container">
                <div class="offline-icon">📡</div>
                <h1>You're Offline</h1>
                <p>
                    DevDash requires an internet connection to function properly. 
                    Please check your connection and try again.
                </p>
                <button onclick="window.location.reload()">
                    Try Again
                </button>
            </div>
        </body>
        </html>
    `;
}

/**
 * Handle Background Sync
 * Sync data when connection is restored
 */
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync triggered:', event.tag);
    
    if (event.tag === 'daily-report-sync') {
        event.waitUntil(syncDailyReports());
    } else if (event.tag === 'metrics-sync') {
        event.waitUntil(syncMetrics());
    }
});

/**
 * Sync Daily Reports
 * Upload pending daily reports when online
 */
async function syncDailyReports() {
    console.log('[SW] Syncing daily reports...');
    
    try {
        // Get pending reports from IndexedDB (would need to be implemented)
        const pendingReports = await getPendingReports();
        
        for (const report of pendingReports) {
            try {
                const response = await fetch('/api/v1/reports/daily/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(report)
                });
                
                if (response.ok) {
                    await removePendingReport(report.id);
                    console.log('[SW] Synced report:', report.id);
                }
            } catch (error) {
                console.error('[SW] Failed to sync report:', report.id, error);
            }
        }
        
        // Notify clients about sync completion
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'REPORTS_SYNCED',
                    count: pendingReports.length
                });
            });
        });
        
    } catch (error) {
        console.error('[SW] Daily report sync failed:', error);
    }
}

/**
 * Sync Metrics
 * Refresh cached metrics data
 */
async function syncMetrics() {
    console.log('[SW] Syncing metrics...');
    
    try {
        // Update cached metrics
        const metricsEndpoints = [
            '/api/v1/dashboard/metrics',
            '/api/v1/integrations/gitlab/metrics',
            '/api/v1/integrations/openproject/metrics',
            '/api/v1/integrations/sonarqube/metrics'
        ];
        
        const cache = await caches.open(DATA_CACHE_NAME);
        
        for (const endpoint of metricsEndpoints) {
            try {
                const response = await fetch(endpoint);
                if (response.ok) {
                    await cache.put(endpoint, response.clone());
                    console.log('[SW] Updated cached metrics:', endpoint);
                }
            } catch (error) {
                console.error('[SW] Failed to update metrics:', endpoint, error);
            }
        }
        
    } catch (error) {
        console.error('[SW] Metrics sync failed:', error);
    }
}

/**
 * Handle Push Notifications (Future Implementation)
 */
self.addEventListener('push', (event) => {
    if (!event.data) return;
    
    const payload = event.data.json();
    const options = {
        body: payload.body,
        icon: '/assets/images/icon-192.png',
        badge: '/assets/images/badge-72.png',
        data: payload.data,
        actions: [
            {
                action: 'view',
                title: 'View Dashboard'
            },
            {
                action: 'dismiss',
                title: 'Dismiss'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(payload.title, options)
    );
});

/**
 * Handle Notification Clicks
 */
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

/**
 * Placeholder functions for IndexedDB operations
 * These would need to be implemented for full offline functionality
 */
async function getPendingReports() {
    // Implementation would query IndexedDB for pending reports
    return [];
}

async function removePendingReport(reportId) {
    // Implementation would remove report from IndexedDB
    console.log('Removing pending report:', reportId);
}

/**
 * Cache Management Utilities
 */
async function clearOldCaches() {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
        name.startsWith('devdash-') && 
        name !== STATIC_CACHE_NAME && 
        name !== DATA_CACHE_NAME
    );
    
    return Promise.all(oldCaches.map(name => caches.delete(name)));
}

async function getCacheSize(cacheName) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    let totalSize = 0;
    for (const key of keys) {
        const response = await cache.match(key);
        if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
        }
    }
    
    return totalSize;
}

/**
 * Performance Monitoring
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_STATS') {
        Promise.all([
            getCacheSize(STATIC_CACHE_NAME),
            getCacheSize(DATA_CACHE_NAME)
        ]).then(([staticSize, dataSize]) => {
            event.ports[0].postMessage({
                staticCacheSize: staticSize,
                dataCacheSize: dataSize,
                totalCacheSize: staticSize + dataSize
            });
        });
    }
});

console.log('[SW] Service worker registered successfully');