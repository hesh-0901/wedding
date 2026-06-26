const CACHE_NAME = "mariage-invites-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html", // Change par le nom exact de ton fichier HTML si différent (ex: generer.html)
  "./style.css",
  "./design-invitation.png",
  "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js",
  "https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&display=swap"
];

// Installation du Service Worker et mise en cache des fichiers essentiels
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Stratégie : Réseau d'abord, sinon Cache (idéal pour Firebase + assets fixes)
self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
