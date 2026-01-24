const CACHE_NAME = "christobuzz-v2";

const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/main.js",
  "/post.js",
  "/ai.js",
  "/wallet.js",
  "/splitprocessor.js"
];

// INSTALL
self.addEventListener("install", event => {
  self.skipWaiting(); // ✅ activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// ACTIVATE
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // ✅ take control immediately
});

// FETCH
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
