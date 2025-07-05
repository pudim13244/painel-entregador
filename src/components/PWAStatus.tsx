import React from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Download, RefreshCw, Wifi, WifiOff, Bell, CheckCircle } from 'lucide-react';

export function PWAStatus() {
  const {
    isInstalled,
    canInstall,
    isOffline,
    hasUpdate,
    isLoading,
    installPWA,
    updatePWA,
    subscribePush
  } = usePWA();
  const token = localStorage.getItem('delivery_token');

  if (isLoading) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {/* Status Offline */}
      {isOffline && (
        <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <WifiOff size={16} />
          <span className="text-sm font-medium">Modo Offline</span>
        </div>
      )}

      {/* Status Online */}
      {!isOffline && (
        <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Wifi size={16} />
          <span className="text-sm font-medium">Online</span>
        </div>
      )}

      {/* Botão de Instalação */}
      {canInstall && !isInstalled && (
        <button
          onClick={installPWA}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
        >
          <Download size={16} />
          <span className="text-sm font-medium">Instalar App</span>
        </button>
      )}

      {/* Status Instalado */}
      {isInstalled && (
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle size={16} />
          <span className="text-sm font-medium">App Instalado</span>
        </div>
      )}

      {/* Botão de Atualização */}
      {hasUpdate && (
        <button
          onClick={updatePWA}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
        >
          <RefreshCw size={16} />
          <span className="text-sm font-medium">Atualizar App</span>
        </button>
      )}

      {/* Botão de Notificação */}
      <button
        onClick={async () => {
          if (!token) {
            alert('Você precisa estar logado para ativar notificações!');
            return;
          }
          const ok = await subscribePush(token);
          if (ok) {
            alert('Notificações push ativadas com sucesso!');
          } else {
            alert('Erro ao ativar notificações push.');
          }
        }}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
      >
        <Bell size={16} />
        <span className="text-sm font-medium">Ativar Notificações</span>
      </button>
    </div>
  );
} 