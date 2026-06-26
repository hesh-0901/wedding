const CACHE_NAME = "mariage-invites-v3"; // Version augmentée pour forcer la mise à jour
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./générateur.html",       // INDISPENSABLE pour que la page s'ouvre offline
  "./lecteur.html",          // INDISPENSABLE pour que le scanner s'ouvre offline
  "./invités.html",          // INDISPENSABLE pour la liste
  "./style.css",
  "./manifest.json",         // Recommandé pour éviter les erreurs PWA offline
  "./design-invitation.png",
  "./firebase-config.js",     // INDISPENSABLE pour la structure des modules Firebase
  
  // CDN Bibliothèques
  "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js", // Scanner offline
  "https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&display=swap",
  
  // Note : Firebase Web SDK charge parfois des sous-modules dynamiques. 
  // L'utilisation des fichiers locaux ou l'import Firebase gère son propre cache local.
];

// 1. Installation : Met en cache agressivement tout le catalogue d'assets
self.addEventListener("install", (e) => {
  self.skipWaiting(); // Force le nouveau service worker à s'activer immédiatement
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Mise en cache offline globale initialisée...");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activation : Nettoie proprement les anciennes versions de caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Suppression de l'ancien cache :", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Prend le contrôle immédiat des pages ouvertes
  );
});

// 3. Stratégie d'interception : Cache d'abord (Idéal pour le Offline total instantané)
self.addEventListener("fetch", (e) => {
  // Optionnel : Ne pas intercepter les requêtes Firestore ou d'authentification directes en Cloud
  if (e.request.url.includes("firestore.googleapis.com") || e.request.url.includes("identitytoolkit")) {
    return; 
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      // Si le fichier est présent dans le cache, on le renvoie instantanément ! (ZÉRO LATENCE)
      if (cachedResponse) {
        return cachedResponse;
      }

      // Sinon, on tente de le récupérer sur le réseau
      return fetch(e.request).then((networkResponse) => {
        // Optionnel : On met en cache les nouvelles ressources découvertes à la volée
        if (networkResponse && networkResponse.status === 200 && e.request.method === "GET") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback ultime si rien ne marche et pas de réseau
        console.log("Ressource non disponible hors-ligne :", e.request.url);
      });
    })
  );
});
