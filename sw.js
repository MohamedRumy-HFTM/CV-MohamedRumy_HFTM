// Service Worker for CV Website - Mobile Performance Optimized
const CACHE_NAME = 'cv-website-v1.2.0';
const STATIC_CACHE = 'static-v1.2.0';
const IMAGE_CACHE = 'images-v1.2.0';
const MOBILE_CACHE = 'mobile-v1.2.0';

// Critical resources for immediate loading
const CRITICAL_RESOURCES = [
    '/',
    '/index.html',
    '/styles.css'
];

// Static resources
const STATIC_RESOURCES = [
    '/scripts.js',
    '/manifest.json'
];

// Images with different caching strategies
const IMAGE_RESOURCES = [
    '/Bilder/Portrait.JPG',
    '/Bilder/HFTM_logo.jpg',
    '/Bilder/KBS_logo.jpeg',
    '/Bilder/Logo_Lanz.jpg',
    '/Bilder/schweizerische-eidgenossenschaft-schweizerkreuz.jpg',
    '/Bilder/SCMN.SW-38a30a24.png'
];

// Install event - cache critical resources first with mobile optimization
self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            // Cache critical resources immediately
            caches.open(STATIC_CACHE).then(cache => cache.addAll(CRITICAL_RESOURCES)),
            // Cache static resources
            caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_RESOURCES)),
            // Cache images with lower priority
            caches.open(IMAGE_CACHE).then(cache => cache.addAll(IMAGE_RESOURCES))
        ]).then(() => {
            console.log('All caches populated successfully');
            // Skip waiting to activate immediately
            return self.skipWaiting();
        }).catch((error) => {
            console.error('Cache installation failed:', error);
        })
    );
});

// Fetch event - performance-optimized caching strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Performance optimization: simpler strategy
    if (request.destination === 'image') {
        event.respondWith(handleImageRequest(request));
    } else if (request.destination === 'script' || request.destination === 'style') {
        event.respondWith(handleStaticRequest(request));
    } else {
        event.respondWith(handlePageRequest(request));
    }
});

async function handleImageRequest(request) {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        // Return cached image immediately
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Simple caching strategy
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch {
        // Return fallback image if network fails
        return cache.match('/Bilder/Portrait.JPG');
    }
}

async function handleStaticRequest(request) {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Simple caching strategy
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch {
        return new Response('', { status: 404 });
    }
}

async function handlePageRequest(request) {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Simple caching strategy
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch {
        return cachedResponse || new Response('', { status: 404 });
    }
}

// Activate event - clean up old caches with mobile optimization
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (![STATIC_CACHE, IMAGE_CACHE, MOBILE_CACHE].includes(cacheName)) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Take control of all clients immediately
            return self.clients.claim();
        })
    );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-form-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Handle background form sync if needed
        console.log('Background sync triggered');
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Push notification handling
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body || 'Neue Nachricht erhalten',
            icon: '/Bilder/Portrait.JPG',
            badge: '/Bilder/Portrait.JPG',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            }
        };

        event.waitUntil(
            self.registration.showNotification(data.title || 'CV Website', options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});
