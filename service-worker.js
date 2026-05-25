const CACHE_NAME = "clickjabo-v3";

const urlsToCache = [

  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/routes.json",
  "/icon.png",
  "/manifest.json",
  "/banner.png",
  "/splash.png",

  "https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css",

  "https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"

];

/* INSTALL */

self.addEventListener(

  "install",

  event => {

    event.waitUntil(

      caches.open(
        CACHE_NAME
      )

      .then(cache => {

        return cache.addAll(
          urlsToCache
        );

      })

    );

  }

);

/* FETCH */

self.addEventListener(

  "fetch",

  event => {

    event.respondWith(

      caches.match(
        event.request
      )

      .then(response => {

        return response ||

        fetch(
          event.request
        );

      })

    );

  }

);

/* ACTIVATE */

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

  }

);