// Service Worker mínimo para push notification

self.addEventListener('install', event => {
  console.log('[SW] Instalado');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Ativado');
  self.clients.claim();
});

self.addEventListener('push', function(event) {
  console.log('[SW] Push recebido:', event);
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
      console.log('[SW] Dados do push:', data);
    } catch (e) {
      console.log('[SW] Erro ao parsear push:', e);
    }
  } else {
    console.log('[SW] Nenhum dado recebido no push');
  }
  const title = data.title || 'Notificação';
  const options = {
    body: data.body || 'Você tem uma nova notificação!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data: data
  };
  event.waitUntil(
    self.registration.showNotification(title, options).then(() => {
      console.log('[SW] showNotification chamado com:', title, options);
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('[SW] Notificação clicada:', event);
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});