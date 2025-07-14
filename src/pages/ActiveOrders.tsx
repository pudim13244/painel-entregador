import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, CreditCard, Smartphone, QrCode, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const paymentLabels: Record<string, string> = {
  CASH: 'Dinheiro',
  CREDIT: 'Cartão de Crédito',
  DEBIT: 'Cartão de Débito',
  PIX: 'PIX',
};

const paymentIcons: Record<string, JSX.Element> = {
  CASH: <DollarSign className="h-4 w-4 mr-1 text-green-600" />,
  CREDIT: <CreditCard className="h-4 w-4 mr-1 text-blue-600" />,
  DEBIT: <CreditCard className="h-4 w-4 mr-1 text-purple-600" />,
  PIX: <QrCode className="h-4 w-4 mr-1 text-teal-600" />,
};

const ActiveOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [finishing, setFinishing] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get('/orders/active');
        setOrders(response.data);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveOrders();
  }, []);

  const handleFinishOrder = async (orderId: number) => {
    setFinishing(orderId);
    try {
      await api.post(`/orders/${orderId}/finish`);
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (err) {
      // Pode exibir um toast de erro se desejar
    } finally {
      setFinishing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-start py-8">
      <div className="w-full max-w-md flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}
          className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold flex-1 text-center">Pedidos em Entrega</h1>
      </div>
      <div className="w-full max-w-md space-y-6">
        {loading ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-lg font-medium">Carregando...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">Nenhum pedido em entrega no momento.</div>
        ) : (
          orders.map(order => (
            <Card key={order.id} className="border-2 border-green-400 shadow-lg rounded-xl transition hover:scale-[1.01]">
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-semibold text-lg text-green-700">#{order.id}</span>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Em entrega</span>
                </div>
                <div className="mb-1">
                  <span className="block font-medium text-gray-800">{order.establishment_name}</span>
                  <span className="block text-sm text-gray-500">Estabelecimento</span>
                </div>
                <div className="mb-1">
                  <span className="block font-medium text-gray-800">{order.customer_name}</span>
                  <span className="block text-sm text-gray-500">Cliente</span>
                </div>
                <div className="mb-1">
                  <span className="block text-gray-700">{order.endereco}</span>
                  <span className="block text-xs text-gray-400">Endereço</span>
                </div>
                <div className="mb-1">
                  <span className="block text-gray-700">{order.customer_phone}</span>
                  <span className="block text-xs text-gray-400">Telefone</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-semibold text-lg text-blue-700 flex items-center">
                    <DollarSign className="h-5 w-5 mr-1 text-blue-700" />
                    {order.value ? `R$ ${Number(order.value).toFixed(2).replace('.', ',')}` : '--'}
                  </span>
                  <span className="ml-4 flex items-center text-sm font-medium">
                    {paymentIcons[order.payment_method] || <CreditCard className="h-4 w-4 mr-1" />}
                    {paymentLabels[order.payment_method] || order.payment_method}
                  </span>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white font-bold flex items-center gap-2 px-4 py-2 rounded-lg shadow"
                    onClick={() => handleFinishOrder(order.id)}
                    disabled={finishing === order.id}
                  >
                    <CheckCircle className="h-5 w-5" />
                    {finishing === order.id ? 'Finalizando...' : 'Pedido Entregue'}
                  </Button>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>{order.created_at ? new Date(order.created_at).toLocaleString() : '-'}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ActiveOrders; 