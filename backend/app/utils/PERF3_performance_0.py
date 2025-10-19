// sw.js - Service Worker Main File

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `app-cache-${CACHE_VERSION}`;

// Resources to cache immediately when SW is installed
const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/scripts/app.js',
  '/images/logo.png',
  '/offline.html'
];

// Resources to cache when requested
const DYNAMIC_CACHE_RESOURCES = [
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  /\.(?:js|css)$/
];

/**
 * Installation handler - caches initial resources
 */
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log('[Service Worker] Precaching resources');
        await cache.addAll(PRECACHE_RESOURCES);
        
        // Skip waiting to activate SW immediately
        await self.skipWaiting();
      } catch (error) {
        console.error('[Service Worker] Precaching failed:', error);
      }
    })()
  );
});

/**
 * Activation handler - cleanup old caches
 */
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      try {
        // Get all cache keys
        const cacheKeys = await caches.keys();
        
        // Delete old caches
        const deletePromises = cacheKeys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key));
        
        await Promise.all(deletePromises);
        console.log('[Service Worker] Old caches deleted');
        
        // Take control of all clients
        await clients.claim();
      } catch (error) {
        console.error('[Service Worker] Cache cleanup failed:', error);
      }
    })()
  );
});

/**
 * Fetch handler - serve cached content when offline
 */
self.addEventListener('fetch', event => {
  event.respondWith(
    (async () => {
      try {
        // Try to get from cache first
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // If not in cache, fetch from network
        const response = await fetch(event.request);
        
        // Don't cache if not a GET request or if it's a browser sync
        if (!event.request.url.startsWith('http') || 
            event.request.method !== 'GET') {
          return response;
        }

        // Check if resource should be cached
        const shouldCache = DYNAMIC_CACHE_RESOURCES.some(pattern => 
          pattern.test(event.request.url)
        );

        if (shouldCache) {
          const cache = await caches.open(CACHE_NAME);
          try {
            await cache.put(event.request, response.clone());
          } catch (error) {
            console.warn('[Service Worker] Cache put failed:', error);
          }
        }

        return response;
      } catch (error) {
        console.error('[Service Worker] Fetch failed:', error);
        
        // Return offline page if available
        const offlineResponse = await caches.match('/offline.html');
        if (offlineResponse) {
          return offlineResponse;
        }
        
        // If all fails, throw the error
        throw error;
      }
    })()
  );
});

/**
 * Handle push notifications
 */
self.addEventListener('push', event => {
  if (!event.data) return;

  const options = {
    body: event.data.text(),
    icon: '/images/notification-icon.png',
    badge: '/images/badge-icon.png'
  };

  event.waitUntil(
    self.registration.showNotification('App Notification', options)
  );
});
