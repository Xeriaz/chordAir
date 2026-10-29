const CACHE_NAME = 'chordair-cache-v8';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

/**
 * Precaches the app shell AND extracts hashed JS/CSS bundle URLs from index.html
 * so the PWA works 100% offline immediately after its very first load.
 */
async function precacheAppShellAndBundles() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(APP_SHELL);

  try {
    const indexResponse = await cache.match('./index.html');
    if (indexResponse) {
      const html = await indexResponse.text();
      const assetMatches = [...html.matchAll(/(?:src|href)=["'](\.\/assets\/[^"']+)["']/g)];
      const assetUrls = assetMatches.map((m) => m[1]);
      if (assetUrls.length > 0) {
        await cache.addAll(assetUrls);
      }
    }
  } catch {
    // Non-fatal if asset extraction fails
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(precacheAppShellAndBundles().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const isNavigation =
    event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') || '').includes('text/html');

  if (isNavigation) {
    // Network-first for index.html so new deployments take effect immediately on reload!
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first with background refresh for static assets & piano audio samples
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const networkFetch = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === 'basic' || networkResponse.type === 'cors')
          ) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkFetch;
    })
  );
});
