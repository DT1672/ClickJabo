const CACHE_NAME = "clickjabo-v2";

const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/routes.json",
  "/icon.png",
  "/manifest.json"
];

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })

  );

});

self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)
      .then(response => {

        return response || fetch(event.request);

      })

  );

});