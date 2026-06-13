const CACHE_NAME = 'louvionhampers-pwa-v2';
const APP_SHELL = [
  '/',
  '/manifest.webmanifest',
  '/logo.jpg',
  '/icons/favicon-32.png',
  '/icons/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-1024.png',
  '/icons/maskable-192.png',
  '/icons/maskable-512.png'
];

const putInCache = async (request, response) => {
  if (!response || response.status === 206) {
    return;
  }

  const responseToCache = response.clone();
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, responseToCache);
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          putInCache('/', response);
          return response;
        })
        .catch(() => caches.match('/'))
    );
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          putInCache(request, response);
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => (
      cached || fetch(request).then((response) => {
        putInCache(request, response);
        return response;
      }).catch(() => caches.match('/'))
    ))
  );
});
