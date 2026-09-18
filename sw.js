/**
 * Naija Draughts - Service Worker (sw.js)
 * Caches essential static assets for fast loading and offline play.
 */

const CACHE_NAME = 'naija-draughts-v1.1';
const STATIC_ASSETS = [
  './',
  './index.php',
  './game.php',
  './puzzles.php',
  './style.css',
  './home.css',
  './puzzles.css',
  './js/app.js',
  './js/engine.js',
  './js/engine50.js',
  './js/rules_engine.js',
  './js/audio.js',
  './manifest.json',
  './favicon.ico',
  './favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Continue even if some optional asset fails
      });
    })
  );
  self.skipWaiting();
});

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

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // Exclude API requests from cache
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        return networkResponse;
      }).catch(() => {
        // Offline fallback
        return caches.match('./index.php');
      });
    })
  );
});
