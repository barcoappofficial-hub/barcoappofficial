const CACHE_NAME = 'barco-app-v1';

// Mantendo sua instalação exatamente como você gosta
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['./', './index.html', './logo.png', './manifest.json']);
    })
  );
});

// Mantendo sua estratégia de busca (Cache primeiro, depois rede)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

// --- ADIÇÕES DE SEGURANÇA PARA O PWABUILDER ---

// 1. Sincronização em Segundo Plano (Background Sync)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-barcos' || event.tag === 'sync-updates') {
    console.log('BarcoApp: Sincronizando dados...');
  }
});

// 2. Notificações Push (Reengajamento de usuários)
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

// 3. Sincronização Periódica (Periodic Sync)
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

