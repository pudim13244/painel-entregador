import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  AlertCircle, 
  DollarSign, 
  MessageSquare, 
  X,
  Check
} from "lucide-react";
import { toast } from 'sonner';

interface NotificationToastProps {
  notification: {
    id: number;
    title: string;
    content: string;
    type: 'ORDER' | 'SYSTEM' | 'PAYMENT' | 'GENERAL';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    action_url?: string;
  };
  onMarkAsRead: (id: number) => void;
  onMarkAsClicked: (id: number) => void;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onMarkAsRead,
  onMarkAsClicked,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide após 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Aguarda a animação terminar
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

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

  const handleMarkAsRead = () => {
    onMarkAsRead(notification.id);
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleAction = () => {
    onMarkAsClicked(notification.id);
    if (notification.action_url) {
      // Aqui você pode adicionar navegação baseada na action_url
      toast.info('Ação executada');
    }
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Card className={`
      fixed top-4 right-4 w-80 z-50 shadow-lg border-l-4 border-l-blue-500
      transform transition-all duration-300 ease-in-out
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
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
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {notification.content}
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleMarkAsRead}
                  className="text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Marcar como lida
                </Button>
                {notification.action_url && (
                  <Button
                    size="sm"
                    onClick={handleAction}
                    className="text-xs"
                  >
                    Ver detalhes
                  </Button>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="p-1 h-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationToast; 