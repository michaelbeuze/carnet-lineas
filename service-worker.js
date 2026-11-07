const CACHE = 'carnet-lineas-v106';
const ASSETS = ['./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Réseau d'abord (les mises à jour arrivent tout de suite), cache en secours hors ligne
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      if(r && (r.ok || r.type === 'opaque')){ const c = r.clone(); caches.open(CACHE).then(ch => ch.put(e.request, c)).catch(()=>{}); }
      return r;
    }).catch(() => caches.match(e.request))
  );
});
