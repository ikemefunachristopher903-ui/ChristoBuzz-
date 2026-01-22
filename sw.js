const CACHE_NAME = "christobuzz-v1";
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

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
