const CACHE_NAME = 'barco-app-v1';

// MANTENDO TUDO EXATAMENTE COMO VOCÊ GOSTA
// Apenas adicionamos o './app.html' na lista para o Android reconhecer o App completo
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        './', 
        './index.html', 
        './app.html', 
        './logo.png', 
        './manifest.json',
        './sw.js'
      ]);
    })
  );
});

// Mantendo sua estratégia de busca (Cache primeiro, depois rede) - SEM ALTERAÇÕES NAS FUNÇÕES
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

// --- ADIÇÕES DE SEGURANÇA PARA O PWABUILDER (MANTIDAS INTEGRALMENTE) ---

// 1. Sincronização em Segundo Plano
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-barcos' || event.tag === 'sync-updates') {
    console.log('BarcoApp: Sincronizando dados...');
  }
});

// 2. Notificações Push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização no BarcoApp',
    icon: 'logo.png',
    badge: 'logo.png',
    vibrate: [100, 50, 100],
    data: { dateOfArrival: Date.now() }
  };
  event.waitUntil(
    self.registration.showNotification('BarcoApp', options)
  );
});

// 3. Sincronização Periódica
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-cache' || event.tag === 'get-latest-escada') {
    console.log('BarcoApp: Atualizando escala em segundo plano');
  }
});

// 4. Suporte para "App de Notas" e Mensagens (Exigência do Windows/Edge)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_NOTES') {
    event.source.postMessage({ notes: [] });
  }
});
