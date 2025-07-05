import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Clock, MapPin, Phone, Store, User } from 'lucide-react';

interface OrderOffer {
  offer_id: number;
  order_id: number;
  status: string;
  created_at: string;
  pedido_id: number;
  order_status: string;
  order_created_at: string;
  cliente: string;
  telefone: string;
  endereco: string;
  estabelecimento: string;
}

interface OrderOfferModalProps {
  offer: OrderOffer | null;
  timeLeft: number;
  isVisible: boolean;
  onAccept: (offerId: number) => void;
  onReject: (offerId: number) => void;
  isLoading?: boolean;
}

export const OrderOfferModal: React.FC<OrderOfferModalProps> = ({
  offer,
  timeLeft,
  isVisible,
  onAccept,
  onReject,
  isLoading = false
}) => {
  if (!isVisible || !offer) {
    return null;
  }

  const handleAccept = () => {
    onAccept(offer.offer_id);
  };

  const handleReject = () => {
    onReject(offer.offer_id);
  };

  // Cor do timer baseada no tempo restante
  const getTimerColor = () => {
    if (timeLeft <= 1) return 'text-red-600';
    if (timeLeft <= 2) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Novo Pedido Disponível!</CardTitle>
            <div className={`flex items-center gap-1 ${getTimerColor()}`}>
              <Clock className="h-4 w-4" />
              <span className="font-bold text-lg">{timeLeft}s</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          {/* Informações do Pedido */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Store className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{offer.estabelecimento}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-700">
              <User className="h-4 w-4 text-green-600" />
              <span>{offer.cliente}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="h-4 w-4 text-purple-600" />
              <span>{offer.telefone}</span>
            </div>
            
            <div className="flex items-start gap-2 text-gray-700">
              <MapPin className="h-4 w-4 text-red-600 mt-0.5" />
              <span className="text-sm">{offer.endereco}</span>
            </div>
          </div>

          {/* Timer Visual */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                timeLeft <= 1 ? 'bg-red-500' : 
                timeLeft <= 2 ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{ width: `${(timeLeft / 5) * 100}%` }}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleReject}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              Recusar
            </Button>
            
            <Button
              onClick={handleAccept}
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? 'Aceitando...' : 'Aceitar Pedido'}
            </Button>
          </div>

          {/* Aviso */}
          <p className="text-xs text-gray-500 text-center">
            Este pedido será oferecido para outro entregador se você não aceitar em {timeLeft} segundos
          </p>
        </CardContent>
      </Card>
    </div>
  );
}; 