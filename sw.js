let cacheName = 'towerlife-0.7.5';
let filesToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/fontawesome.js',
    '/solid.js'
];
self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});
self.addEventListener('activate', function(e) {
    e.waitUntil(caches.keys()
        .then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName)
                    console.log("deleted: " + key);
                    return caches.delete(key);
            }));
        }));
    return self.clients.claim();
});
self.addEventListener('fetch', function(e) {
    e.respondWith(caches.match(e.request)
        .then(function(response) {
            return response || fetch(e.request)
                .then(function (resp){
                    return caches.open(cacheName)
                        .then(function(cache){
                            cache.put(e.request, resp.clone());
                            return resp;
                        })
                }).catch(function(event){
                    console.log('Error fetching data!');
                })
        })
    );
});