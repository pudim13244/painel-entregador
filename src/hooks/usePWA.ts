import { useState, useEffect } from 'react';
// import { registerSW } from 'virtual:pwa-register'; // Removido pois não está sendo usado diretamente
import axios from 'axios';

interface PWAStatus {
  isInstalled: boolean;
  canInstall: boolean;
  isOffline: boolean;
  hasUpdate: boolean;
  isLoading: boolean;
}

export function usePWA() {
  const [status, setStatus] = useState<PWAStatus>({
    isInstalled: false,
    canInstall: false,
    isOffline: false,
    hasUpdate: false,
    isLoading: true
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Verifica se o app está instalado
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setStatus(prev => ({ ...prev, isInstalled: true }));
      }
    };

    // Verifica se pode instalar
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setStatus(prev => ({ ...prev, canInstall: true }));
    };

    // Detecta instalação
    const handleAppInstalled = () => {
      setStatus(prev => ({ ...prev, isInstalled: true, canInstall: false }));
      setDeferredPrompt(null);
    };

    // Monitora status online/offline
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOffline: false }));
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOffline: true }));
    };

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificações iniciais
    checkIfInstalled();
    setStatus(prev => ({ ...prev, isOffline: !navigator.onLine, isLoading: false }));

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Função para instalar o PWA
  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Usuário ${outcome === 'accepted' ? 'aceitou' : 'rejeitou'} a instalação`);
      setDeferredPrompt(null);
      setStatus(prev => ({ ...prev, canInstall: false }));
    }
  };

  // Função para atualizar o PWA
  const updatePWA = () => {
    // Remover uso de registerSW
    setStatus(prev => ({ ...prev, hasUpdate: false }));
  };

  // Função para solicitar permissão de notificação
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  // Função para enviar notificação
  const sendNotification = (title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options
      });
    }
  };

  // Função para registrar subscription de push no backend
  const subscribePush = async (userToken: string) => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Seu navegador não suporta notificações push!');
      return false;
    }
    try {
      // Obter chave pública VAPID do backend
      const { data } = await axios.get('/push/vapid-public-key');
      const publicKey = data.publicKey;
      // Registrar SW
      const registration = await navigator.serviceWorker.ready;
      // Assinar push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });
      // Enviar subscription para backend
      await axios.post('/push/subscribe', { subscription }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      return true;
    } catch (err) {
      console.error('Erro ao registrar push:', err);
      return false;
    }
  };

  // Função utilitária para converter chave VAPID
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return {
    ...status,
    installPWA,
    updatePWA,
    requestNotificationPermission,
    sendNotification,
    subscribePush
  };
} 