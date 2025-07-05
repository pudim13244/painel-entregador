import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import api from '@/services/api';

interface Notification {
  id: number;
  title: string;
  content: string;
  type: 'ORDER' | 'SYSTEM' | 'PAYMENT' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  read: boolean;
  clicked: boolean;
  read_at: string | null;
  clicked_at: string | null;
  created_at: string;
  action_url?: string;
}

interface NotificationSettings {
  order_notifications: boolean;
  system_notifications: boolean;
  payment_notifications: boolean;
  push_notifications: boolean;
  email_notifications: boolean;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings | null;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAsClicked: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  updateSettings: (newSettings: Partial<NotificationSettings>) => Promise<void>;
  refreshAll: () => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(false);

  // Buscar notificações
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unread_count);
    } catch (err) {
      console.error('Erro ao buscar notificações:', err);
      toast.error('Erro ao carregar notificações');
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar contador de não lidas
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      setUnreadCount(response.data.unread_count);
    } catch (err) {
      console.error('Erro ao buscar contador de notificações:', err);
      setUnreadCount(0);
    }
  }, []);

  // Buscar configurações
  const fetchSettings = useCallback(async () => {
    try {
      const response = await api.get('/notifications/settings');
      setSettings(response.data);
    } catch (err) {
      console.error('Erro ao buscar configurações:', err);
    }
  }, []);

  // Marcar como lida
  const markAsRead = useCallback(async (id: number) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erro ao marcar como lida:', err);
      toast.error('Erro ao marcar notificação como lida');
    }
  }, []);

  // Marcar como clicada
  const markAsClicked = useCallback(async (id: number) => {
    try {
      await api.post(`/notifications/${id}/click`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, clicked: true, clicked_at: new Date().toISOString() } : n)
      );
    } catch (err) {
      console.error('Erro ao marcar como clicada:', err);
      toast.error('Erro ao marcar notificação como clicada');
    }
  }, []);

  // Marcar todas como lidas
  const markAllAsRead = useCallback(async () => {
    try {
      await api.post('/notifications/mark-all-read');
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
      toast.success('Todas as notificações foram marcadas como lidas');
    } catch (err) {
      console.error('Erro ao marcar todas como lidas:', err);
      toast.error('Erro ao marcar notificações como lidas');
    }
  }, []);

  // Atualizar configurações
  const updateSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await api.put('/notifications/settings', updatedSettings);
      setSettings(updatedSettings as NotificationSettings);
      toast.success('Configurações atualizadas');
    } catch (err) {
      console.error('Erro ao atualizar configurações:', err);
      toast.error('Erro ao atualizar configurações');
    }
  }, [settings]);

  // Atualizar tudo
  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchNotifications(),
      fetchSettings()
    ]);
  }, [fetchNotifications, fetchSettings]);

  // Carregar dados iniciais
  useEffect(() => {
    fetchUnreadCount();
    fetchSettings();
  }, [fetchUnreadCount, fetchSettings]);

  return {
    notifications,
    unreadCount,
    settings,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAsClicked,
    markAllAsRead,
    updateSettings,
    refreshAll
  };
}; 