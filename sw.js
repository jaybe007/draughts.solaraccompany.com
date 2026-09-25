/**
 * Naija Draughts - Service Worker (sw.js)
 * Caches essential static assets for fast loading and offline play.
 */

const CACHE_NAME = 'naija-draughts-v2.5';
const STATIC_ASSETS = [
  './',
  './index.php',
  './game.php',
  './puzzles.php',
  './style.css',
  './home.css',
  './lidraughts_game.css',
  './puzzles.css',
  './images/hero_draughts.jpg',
  './images/board/wood-1024_100.jpg',
  './images/board/wood-1024_100_mirrored.jpg',
  './images/man_white.svg',
  './images/man_black.svg',
  './images/king_white.svg',
  './images/king_black.svg',
  './js/app.js',
  './js/engine.js',
  './js/rules_engine.js',
  './js/ai.js',
  './js/timer.js',
  './js/replay.js',
  './js/analysis.js',
  './js/chat.js',
  './js/traps.js',
  './js/puzzle_trainer.js',
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
      return cache.addAll(STATIC_ASSETS).catch(() => {});
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
  if (event.request.url.includes('/api/')) return;

  // Network-First with Cache Fallback for instant updates and reliable offline play
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.url.startsWith(self.location.origin)) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone)).catch(() => {});
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          if (event.request.mode === 'navigate') {
            return caches.match('./index.php');
          }
          return new Response('', { status: 404, statusText: 'Not Found' });
        });
      })
  );
});
