const CACHE_NAME = 'theoliver-cache-v1';
const TO_CACHE = [
  './index.html',
  './manifest.json',
  // icons will be cached on first fetch
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(TO_CACHE))
  );
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(resp => resp || fetch(evt.request).then(r=>{
      // optionally cache new requests (images, icons)
      if (evt.request.method === 'GET' && r && r.status === 200){
        const clone = r.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(evt.request, clone);
        });
      }
      return r;
    }).catch(()=>caches.match('./index.html')))
  );
});