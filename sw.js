/**
 * Naija Draughts - High Performance Progressive Web App (PWA) Service Worker
 * Version: v3.1
 * Provides offline shell, static asset caching, and real-time bypass for financial/game APIs.
 */

const CACHE_NAME = 'naija-draughts-v3.1';
const STATIC_ASSETS = [
  './',
  './index.php',
  './dashboard.php',
  './game.php',
  './puzzles.php',
  './style.css',
  './home.css',
  './lidraughts_game.css',
  './puzzles.css',
  './js/app.js',
  './js/dashboard.js',
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
  './js/pwa.js',
  './manifest.json',
  './favicon.ico',
  './favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './images/man_white.svg',
  './images/man_black.svg',
  './images/king_white.svg',
  './images/king_black.svg'
];

// Install: Cache critical static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[PWA SW] Non-fatal asset precache failure', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Prune stale cache versions
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

// Fetch: Strategy Matrix
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = req.url;

  // 1. NEVER cache live game actions, auth, or monetary transactions
  if (
    url.includes('/api/') || 
    url.includes('auth.php') || 
    url.includes('admin.php') ||
    url.includes('download_tournament_guide.php')
  ) {
    return; // Pass through to real-time network
  }

  // 2. Static Assets (Images, CSS, JS, Fonts): Stale-While-Revalidate
  const isStatic = (
    url.endsWith('.css') || 
    url.endsWith('.js') || 
    url.endsWith('.svg') || 
    url.endsWith('.png') || 
    url.endsWith('.jpg') || 
    url.endsWith('.ico') || 
    url.endsWith('.json')
  );

  if (isStatic) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone)).catch(() => {});
          }
          return networkRes;
        }).catch(() => cached);

        return cached || fetchPromise;
      })
    );
    return;
  }

  // 3. Navigation Pages (HTML/PHP): Network-first with Cache Fallback
  event.respondWith(
    fetch(req)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200 && url.startsWith(self.location.origin)) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone)).catch(() => {});
        }
        return networkRes;
      })
      .catch(() => {
        return caches.match(req).then((cached) => {
          if (cached) return cached;
          if (req.mode === 'navigate') {
            return caches.match('./dashboard.php').then((dash) => dash || caches.match('./index.php'));
          }
          return new Response('Offline: Connection required for live draughts matches.', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
  );
});
