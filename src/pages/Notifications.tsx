import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Check, 
  Settings, 
  ArrowLeft, 
  Trash2, 
  Package, 
  AlertCircle, 
  DollarSign, 
  MessageSquare,
  RefreshCw,
  Filter
} from "lucide-react";
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

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Buscar notificações
  const fetchNotifications = async () => {
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
  };

  // Buscar configurações
  const fetchSettings = async () => {
    try {
      const response = await api.get('/notifications/settings');
      setSettings(response.data);
    } catch (err) {
      console.error('Erro ao buscar configurações:', err);
    }
  };

  // Marcar como lida
  const markAsRead = async (id: number) => {
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
  };

  // Marcar como clicada
  const markAsClicked = async (id: number) => {
    try {
      await api.post(`/notifications/${id}/click`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, clicked: true, clicked_at: new Date().toISOString() } : n)
      );
    } catch (err) {
      console.error('Erro ao marcar como clicada:', err);
      toast.error('Erro ao marcar notificação como clicada');
    }
  };

  // Marcar todas como lidas
  const markAllAsRead = async () => {
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
  };

  // Atualizar configurações
  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await api.put('/notifications/settings', updatedSettings);
      setSettings(updatedSettings as NotificationSettings);
      toast.success('Configurações atualizadas');
    } catch (err) {
      console.error('Erro ao atualizar configurações:', err);
      toast.error('Erro ao atualizar configurações');
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    fetchNotifications();
    fetchSettings();
  }, []);

  // Filtrar notificações baseado na aba ativa
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') {
      return !notification.read;
    }
    if (filterType !== 'all') {
      return notification.type === filterType;
    }
    return true;
  });

  // Obter ícone baseado no tipo
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ORDER':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'PAYMENT':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'SYSTEM':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  // Obter cor do badge baseado na prioridade
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800';
      case 'LOW':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Agora mesmo';
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Notificações</h1>
              <p className="text-sm text-gray-500">
                {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchNotifications}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
              >
                <Check className="h-4 w-4 mr-1" />
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="unread">
              Não lidas
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="space-y-4">
              {/* Filtro por tipo */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="ORDER">Pedidos</option>
                  <option value="PAYMENT">Pagamentos</option>
                  <option value="SYSTEM">Sistema</option>
                  <option value="GENERAL">Geral</option>
                </select>
              </div>

              {/* Lista de notificações */}
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                  <p className="text-gray-500 mt-2">Carregando notificações...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="text-gray-500 mt-2">
                    {activeTab === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação encontrada'}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification, index) => (
                  <Card
                    key={`all-${notification.id}-${index}`}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification.id);
                      }
                      if (notification.action_url) {
                        markAsClicked(notification.id);
                        // Aqui você pode adicionar navegação baseada na action_url
                        toast.info('Ação executada');
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-sm">
                                {notification.title}
                              </h3>
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                              {!notification.read && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                  Nova
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.content}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>{formatDate(notification.created_at)}</span>
                              {notification.clicked && (
                                <span className="flex items-center">
                                  <Check className="h-3 w-3 mr-1" />
                                  Visualizada
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="unread" className="mt-4">
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                  <p className="text-gray-500 mt-2">Carregando notificações...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Check className="h-12 w-12 mx-auto text-green-400" />
                  <p className="text-gray-500 mt-2">Todas as notificações foram lidas!</p>
                </div>
              ) : (
                filteredNotifications.map((notification, index) => (
                  <Card
                    key={`unread-${notification.id}-${index}`}
                    className="border-l-4 border-l-blue-500 bg-blue-50 cursor-pointer transition-all hover:shadow-md"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-sm">
                              {notification.title}
                            </h3>
                            <Badge className={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.content}
                          </p>
                          <span className="text-xs text-gray-400">
                            {formatDate(notification.created_at)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            {settings && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Configurações de Notificação</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificações de Pedidos</h4>
                      <p className="text-sm text-gray-500">Receber notificações sobre novos pedidos</p>
                    </div>
                    <Switch
                      checked={settings.order_notifications}
                      onCheckedChange={(checked) => updateSettings({ order_notifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificações de Pagamento</h4>
                      <p className="text-sm text-gray-500">Receber notificações sobre pagamentos</p>
                    </div>
                    <Switch
                      checked={settings.payment_notifications}
                      onCheckedChange={(checked) => updateSettings({ payment_notifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificações do Sistema</h4>
                      <p className="text-sm text-gray-500">Receber notificações sobre manutenções e atualizações</p>
                    </div>
                    <Switch
                      checked={settings.system_notifications}
                      onCheckedChange={(checked) => updateSettings({ system_notifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificações Push</h4>
                      <p className="text-sm text-gray-500">Receber notificações push no dispositivo</p>
                    </div>
                    <Switch
                      checked={settings.push_notifications}
                      onCheckedChange={(checked) => updateSettings({ push_notifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificações por Email</h4>
                      <p className="text-sm text-gray-500">Receber notificações por email</p>
                    </div>
                    <Switch
                      checked={settings.email_notifications}
                      onCheckedChange={(checked) => updateSettings({ email_notifications: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notifications;
