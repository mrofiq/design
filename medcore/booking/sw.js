const CACHE_NAME = 'medcore-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/offline.html'
];

// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error('Failed to cache resources during install:', error);
            })
    );
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Ensure the service worker takes control of all clients immediately
    self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    console.log('Cache hit for:', event.request.url);
                    return response;
                }

                // Clone the request because it's a stream
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then((response) => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response because it's a stream
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            // Only cache successful GET requests for same origin
                            if (event.request.method === 'GET' &&
                                event.request.url.startsWith(self.location.origin)) {
                                cache.put(event.request, responseToCache);
                            }
                        });

                    return response;
                }).catch((error) => {
                    console.error('Fetch failed:', error);

                    // Return offline page for navigation requests
                    if (event.request.destination === 'document') {
                        return caches.match('/offline.html').then((offlineResponse) => {
                            if (offlineResponse) {
                                return offlineResponse;
                            }
                            // Fallback offline page
                            return new Response(`
                                <!DOCTYPE html>
                                <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>Offline - MedCore</title>
                                    <style>
                                        body {
                                            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                                            text-align: center;
                                            padding: 2rem;
                                            background: #f9fafb;
                                            color: #374151;
                                        }
                                        .offline-icon {
                                            font-size: 4rem;
                                            margin-bottom: 1rem;
                                        }
                                        h1 {
                                            color: #1f2937;
                                            margin-bottom: 1rem;
                                        }
                                        p {
                                            margin-bottom: 2rem;
                                            line-height: 1.6;
                                        }
                                        .btn {
                                            display: inline-block;
                                            padding: 0.75rem 1.5rem;
                                            background: #0066FF;
                                            color: white;
                                            text-decoration: none;
                                            border-radius: 0.5rem;
                                            font-weight: 600;
                                        }
                                    </style>
                                </head>
                                <body>
                                    <div class="offline-icon">📱</div>
                                    <h1>You're Offline</h1>
                                    <p>Please check your internet connection and try again.</p>
                                    <button class="btn" onclick="window.location.reload()">Try Again</button>
                                </body>
                                </html>
                            `, {
                                headers: {
                                    'Content-Type': 'text/html',
                                    'Cache-Control': 'no-cache'
                                }
                            });
                        });
                    }

                    // For other requests, just throw the error
                    throw error;
                });
            })
    );
});

// Background sync for offline booking submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync-booking') {
        console.log('Background sync triggered for booking');
        event.waitUntil(syncBookings());
    }
});

// Handle background sync for bookings
async function syncBookings() {
    try {
        // Get pending bookings from IndexedDB or localStorage
        const pendingBookings = JSON.parse(localStorage.getItem('pendingBookings') || '[]');

        if (pendingBookings.length > 0) {
            console.log('Syncing', pendingBookings.length, 'pending bookings');

            // Process each pending booking
            for (const booking of pendingBookings) {
                try {
                    const response = await fetch('/api/appointments', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(booking)
                    });

                    if (response.ok) {
                        // Remove successful booking from pending list
                        const index = pendingBookings.indexOf(booking);
                        pendingBookings.splice(index, 1);
                        console.log('Successfully synced booking:', booking.id);
                    }
                } catch (error) {
                    console.error('Failed to sync booking:', booking.id, error);
                }
            }

            // Update localStorage with remaining pending bookings
            localStorage.setItem('pendingBookings', JSON.stringify(pendingBookings));
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Handle push notifications (future feature)
self.addEventListener('push', (event) => {
    console.log('Push received:', event);

    const options = {
        body: event.data ? event.data.text() : 'New appointment reminder',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'view',
                title: 'View Appointment',
                icon: '/icon-192.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icon-192.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('MedCore Booking', options)
    );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('Notification click received:', event);

    event.notification.close();

    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Handle message from client
self.addEventListener('message', (event) => {
    console.log('SW received message:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('Service Worker script loaded');