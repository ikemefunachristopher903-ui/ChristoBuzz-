const CACHE_NAME = "christobuzz-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/main.js",
  "/post.js",
  "/reels.js",
  "/filters.js",
  "/follow.js",
  "/messages.js",
  "/notifications.js",
  "/profile.js",
  "/marketplace.js",
  "/music.js",
  "/wallet.js",
  "/demo.js",
  "/policy.js",
  "/supabase.js",
  "/pwa.js",
  "/adnetwork.js",
  "/postinteractions.js",
  "/stories.js",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg"
];

// Install event
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching assets...");
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch event - serve cached first
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then(networkResponse => {
          // Cache new requests dynamically
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // Fallback: could show offline page if needed
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        });
    })
  );
});
