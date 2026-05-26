const CACHE_NAME =
"clickjabo-v6";

const STATIC_CACHE = [

  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/icon.png",
  "/manifest.json",
  "/banner.png",
  "/splash.png",

  "https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css",

  "https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"

];

/* =========================
INSTALL
========================= */

self.addEventListener(

  "install",

  event => {

    event.waitUntil(

      caches.open(
        CACHE_NAME
      )

      .then(cache => {

        return cache.addAll(
          STATIC_CACHE
        );

      })

    );

    self.skipWaiting();

  }

);

/* =========================
ACTIVATE
========================= */

self.addEventListener(

  "activate",

  event => {

    event.waitUntil(

      caches.keys()

      .then(keys => {

        return Promise.all(

          keys.map(key => {

            if(
              key !== CACHE_NAME
            ){

              return caches.delete(
                key
              );

            }

          })

        );

      })

    );

    self.clients.claim();

  }

);

/* =========================
FETCH
========================= */

self.addEventListener(

  "fetch",

  event => {

    if(
      event.request.method !==
      "GET"
    ){

      return;

    }

    event.respondWith(

      caches.match(
        event.request
      )

      .then(cachedResponse => {

        if(cachedResponse){

          fetch(
            event.request
          )

          .then(networkResponse => {

            return caches.open(
              CACHE_NAME
            )

            .then(cache => {

              cache.put(
                event.request,
                networkResponse.clone()
              );

            });

          })

          .catch(() => {});

          return cachedResponse;

        }

        return fetch(
          event.request
        )

        .then(networkResponse => {

          const clonedResponse =
          networkResponse.clone();

          caches.open(
            CACHE_NAME
          )

          .then(cache => {

            cache.put(
              event.request,
              clonedResponse
            );

          });

          return networkResponse;

        })

        .catch(() => {

          if(

            event.request.mode ===
            "navigate"

          ){

            return caches.match(
              "/index.html"
            );

          }

        });

      })

    );

  }

);

/* =========================
MESSAGE
========================= */

self.addEventListener(

  "message",

  event => {

    if(

      event.data &&

      event.data.type ===
      "SKIP_WAITING"

    ){

      self.skipWaiting();

    }

  }

);