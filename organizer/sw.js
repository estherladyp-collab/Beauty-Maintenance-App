const V = 'maintaining-home-v2', SHELL = ['./', 'index.html', 'styles.css', 'fonts.css', 'seed.js', 'store.js', 'app.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png',
  'fonts/CormorantGaramond-normal-400-latin.woff2', 'fonts/CormorantGaramond-normal-500-latin.woff2', 'fonts/CormorantGaramond-normal-600-latin.woff2', 'fonts/CormorantGaramond-italic-400-latin.woff2', 'fonts/CormorantGaramond-italic-500-latin.woff2',
  'fonts/HankenGrotesk-normal-400-latin.woff2', 'fonts/HankenGrotesk-normal-500-latin.woff2', 'fonts/HankenGrotesk-normal-600-latin.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
