import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { ArrowLeft, Download } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

import { Package, DollarSign, Truck, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// FooterBar modernizado com navegação
const FooterBar = ({ notifications, faturamento, activeOrders }: { notifications: number, faturamento: number, activeOrders: number }) => {
  const navigate = useNavigate();
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div className="flex justify-around items-center">
        <div 
          className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/')}
        >
          <div className="relative">
            <Package className="h-6 w-6 text-gray-600" />
            {notifications > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {notifications}
              </Badge>
            )}
          </div>
          <span className="text-xs text-gray-600 mt-1">Dashboard</span>
        </div>
        <div 
          className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/faturamento')}
        >
          <DollarSign className="h-6 w-6 text-green-600" />
          <span className="text-xs text-gray-600 mt-1">{formatCurrency(faturamento)}</span>
        </div>
        <div 
          className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/recebimentos')}
        >
          <div className="relative">
            <Truck className="h-6 w-6 text-orange-600" />
            {activeOrders > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500">
                {activeOrders}
              </Badge>
            )}
          </div>
          <span className="text-xs text-gray-600 mt-1">Recebimentos</span>
        </div>
        <div 
          className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/profile')}
        >
          <User className="h-6 w-6 text-blue-600" />
          <span className="text-xs text-gray-600 mt-1">Perfil</span>
        </div>
      </div>
    </div>
  );
};

const FaturamentoEstabelecimento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [establishmentName, setEstablishmentName] = useState('');
  const { unreadCount: unreadNotifications, fetchUnreadCount } = useNotifications();
  const [todayFaturamento, setTodayFaturamento] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);

  const fetchOrders = async (selectedDate: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/delivery-history`);
      // Filtrar por estabelecimento e data
      const filtered = response.data.filter((order: any) => {
        return (
          order.establishment_id == id &&
          order.finished_at &&
          order.finished_at.slice(0, 10) === selectedDate
        );
      });
      setOrders(filtered);
      setEstablishmentName(filtered[0]?.establishment_name || '');
    } catch (err) {
      setOrders([]);
      setEstablishmentName('');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveOrders = async () => {
    try {
      const response = await api.get('/orders/active');
      setActiveOrders(response.data.length);
    } catch (err) {
      setActiveOrders(0);
    }
  };

  useEffect(() => {
    fetchOrders(date);
    fetchActiveOrders();
    fetchUnreadCount();
    // eslint-disable-next-line
  }, [date, id]);

  useEffect(() => {
    // Calcular faturamento do dia para o FooterBar
    const today = new Date();
    const todayOrders = orders.filter((order: any) => {
      if (!order.finished_at) return false;
      const orderDate = new Date(order.finished_at);
      return (
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      );
    });
    const totalToday = todayOrders.reduce((sum: number, order: any) => sum + (Number(order.delivery_fee) || 0), 0);
    setTodayFaturamento(totalToday);
  }, [orders]);

  // Totais
  const totalPedidos = orders.length;
  const totalTaxas = orders.reduce((sum: number, o: any) => sum + (Number(o.delivery_fee) || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col pb-16">
      {/* Header modernizado */}
      <header className="w-full bg-white border-b shadow-sm px-4 py-4 flex items-center gap-4 sticky top-0 z-20">
        <button
          className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-2 py-1 rounded transition"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" /> Voltar
        </button>
        <h1 className="text-lg md:text-xl font-bold text-gray-800 flex-1 truncate">
          Faturamento: {establishmentName}
        </h1>
      </header>

      {/* Cards de totais minimalistas */}
      <div className="max-w-2xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 px-4">
        <div className="bg-white rounded-xl border p-4 flex flex-col items-center shadow-sm">
          <span className="text-gray-500 text-xs">Pedidos</span>
          <span className="text-2xl font-bold text-blue-700 mt-1">{totalPedidos}</span>
        </div>
        <div className="bg-white rounded-xl border p-4 flex flex-col items-center shadow-sm">
          <span className="text-gray-500 text-xs">Total Taxas</span>
          <span className="text-2xl font-bold text-green-700 mt-1">R$ {totalTaxas.toFixed(2)}</span>
        </div>
      </div>

      {/* Filtro e tabela modernizados */}
      <main className="flex-1 max-w-2xl w-full mx-auto mt-8 px-4 pb-24">
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <div className="flex-1">
            <label className="block font-medium mb-1 text-gray-700">Data:</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-auto focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded mt-2 md:mt-0 shadow"
            onClick={() => fetchOrders(date)}
          >Filtrar</button>
        </div>
        <div className="bg-white rounded-xl border p-0 md:p-4 overflow-x-auto shadow-sm">
          <h2 className="text-base font-semibold mb-4 text-gray-800 px-4 pt-4">Pedidos entregues</h2>
          {loading ? (
            <p className="text-center text-gray-500 py-8">Carregando...</p>
          ) : orders.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p className="text-base font-medium">Nenhum pedido entregue nesta data.</p>
            </div>
          ) : (
            <table className="w-full min-w-[500px] text-left border-separate border-spacing-y-1">
              <thead className="bg-gray-100 sticky top-0 z-10 rounded-lg">
                <tr>
                  <th className="py-2 px-2 rounded-tl-lg text-sm font-bold text-gray-700">ID</th>
                  <th className="py-2 px-2 text-sm font-bold text-gray-700">Taxa</th>
                  <th className="py-2 px-2 text-sm font-bold text-gray-700">Entregador</th>
                  <th className="py-2 px-2 rounded-tr-lg text-sm font-bold text-gray-700">Data/Hora</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.order_id} className="bg-white hover:bg-blue-50 transition rounded-lg">
                    <td className="py-2 px-2 font-medium">{order.order_id}</td>
                    <td className="py-2 px-2">R$ {Number(order.delivery_fee).toFixed(2)}</td>
                    <td className="py-2 px-2">{order.delivery_name || '-'}</td>
                    <td className="py-2 px-2">{order.finished_at ? new Date(order.finished_at).toLocaleString('pt-BR') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      {/* Navegação inferior moderna */}
      <FooterBar notifications={unreadNotifications} faturamento={todayFaturamento} activeOrders={activeOrders} />
    </div>
  );
};

export default FaturamentoEstabelecimento; 