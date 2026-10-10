// AMSED Service Worker - Offline & PWA support
const CACHE_NAME = 'amsed-v1-cache';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/logo-512.png',
  '/favicon.png',
  '/logo_amesd_original_transparent.png'
];

// Install: pre-cache static shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Pre-cache asset warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network first with Cache fallback for navigation & scripts
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Don't intercept non-GET or chrome-extension requests
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;

  // For API or Firestore calls, do not cache with service worker (Firestore has its own IndexedDB persistence)
  if (req.url.includes('firestore.googleapis.com') || req.url.includes('/api/')) {
    return;
  }

  // Network-first strategy with cache fallback
  event.respondWith(
    fetch(req)
      .then((networkResponse) => {
        // If successful response, cache a clone for offline use
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Network failed (Offline mode)
        const cachedResponse = await caches.match(req);
        if (cachedResponse) {
          return cachedResponse;
        }

        // If it's a page navigation request, return cached index.html
        if (req.mode === 'navigate') {
          const indexFallback = await caches.match('/index.html');
          if (indexFallback) return indexFallback;
          const rootFallback = await caches.match('/');
          if (rootFallback) return rootFallback;
        }

        return new Response('Offline - No connection', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
        });
      })
  );
});
