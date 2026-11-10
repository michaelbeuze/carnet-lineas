const CACHE = 'esprit-leger-v1';
const ASSETS = ['./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  // Ne supprime que les anciens caches de cette app (pas ceux du Carnet Lineas)
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('esprit-leger-') && k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Réseau d'abord, cache en secours hors ligne
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r && (r.ok || r.type === 'opaque')) { const c = r.clone(); caches.open(CACHE).then(ch => ch.put(e.request, c)).catch(() => {}); }
      return r;
    }).catch(() => caches.match(e.request))
  );
});
