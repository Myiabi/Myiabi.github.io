const CACHE_NAME = "cold-memories-v1";

// Lista de arquivos para cache (adicione mais conforme necessário)
const urlsToCache = [
  "/",
  "/index.html",
  "/city.html",
  "/city.css",
  "/city.js",
  "/cutscene.html",
  "/end.html",
  "/end.css",
  "/end.js",
  "/loader.js",
  "/dev.js",
  "/core/global.css",
  "/core/global.js",
  "/core/caixa_dialogo/falas.js",
  "/core/caixa_dialogo/script.js",
  "/core/menu_interativo/script.js",
  "/core/menu_interativo/style.css",
  "/core/popup/script.js",
  "/core/popup/style.css",
  "/core/save/script.js",
  "/core/save/style.css",
  "/core/sound/script.js",
  "/core/sound/style.css",
  "/core/yesorno/script.js",
  "/core/yesorno/style.css",
  // Cenários
  "/cenarios/bar/index.html",
  "/cenarios/bar/script.js",
  "/cenarios/bar/style.css",
  "/cenarios/blizzard/index.html",
  "/cenarios/blizzard/script.js",
  "/cenarios/blizzard/style.css",
  "/cenarios/cave/index.html",
  "/cenarios/cave/script.js",
  "/cenarios/cave/style.css",
  "/cenarios/final/index.html",
  "/cenarios/fire/index.html",
  "/cenarios/fire/script.js",
  "/cenarios/fire/style.css",
  "/cenarios/forest/index.html",
  "/cenarios/forest/script.js",
  "/cenarios/forest/style.css",
  "/cenarios/lake/index.html",
  "/cenarios/lake/script.js",
  "/cenarios/lake/style.css",
  "/cenarios/market/index.html",
  "/cenarios/market/script.js",
  "/cenarios/market/style.css",
  "/cenarios/snow/index.html",
  "/cenarios/snow/style.css",
  "/cenarios/templo/index.html",
  "/cenarios/templo/script.js",
  "/cenarios/templo/style.css",
  // Scripts
  "/scripts/dropmoon/script.js",
  "/scripts/dropmoon/style.css",
  "/scripts/jardim/script.js",
  "/scripts/jardim/style.css",
  "/scripts/mesas/script.js",
  "/scripts/mesas/style.css",
  "/scripts/pescaria/script.js",
  "/scripts/pescaria/style.css",
  "/scripts/wendigo_fight/script.js",
  "/scripts/wendigo_fight/style.css",
];

// Instalação do Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Cache aberto");
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error("Erro ao fazer cache:", error);
      })
  );
  // Força a ativação imediata
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Removendo cache antigo:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Toma controle de todas as páginas imediatamente
  self.clients.claim();
});

// Estratégia: Network First com fallback para cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a resposta for válida, armazena no cache
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Se falhar, tenta buscar do cache
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          // Se não encontrar no cache, retorna uma página offline básica para navegação
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
      })
  );
});
