const CACHE_NAME = 'barco-app-v2';

// 1. INSTALAÇÃO - MANTENDO TUDO O QUE VOCÊ JÁ TINHA
// Adicionamos 'icone.png' e 'app.html' para garantir que o Android libere o botão
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        './', 
        './index.html', 
        './app.html', 
        './logo.png', 
        './icone.png', 
        './manifest.json',
        './sw.js'
      ]);
    })
  );
});

// 2. ESTRATÉGIA DE BUSCA - (Cache primeiro, depois rede)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

// --- ADIÇÕES DE SEGURANÇA E PWA (MANTIDAS INTEGRALMENTE) ---

// 3. Sincronização em Segundo Plano
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-barcos' || event.tag === 'sync-updates') {
    console.log('BarcoApp: Sincronizando dados...');
  }
});

// 4. Notificações Push
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

// 5. Sincronização Periódica
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-cache' || event.tag === 'get-latest-escada') {
    console.log('BarcoApp: Atualizando escala em segundo plano');
  }
});

// 6. Suporte para Mensagens (Exigência Windows/Edge)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_NOTES') {
    event.source.postMessage({ notes: [] });
  }
});
