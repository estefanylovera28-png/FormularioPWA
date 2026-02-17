const CACHE_NAME = 'makingpit-v-final';
const ASSETS = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Este bloque es el que arregla tu segunda foto
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Si el archivo está en caché, lo entrega de inmediato sin buscar en internet
      return response || fetch(event.request);
    })
  );
});