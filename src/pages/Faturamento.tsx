import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, Truck, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';

// FooterBar modernizado
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

const MAX_DAYS_RANGE = 31;

const Faturamento = () => {
  const today = new Date();
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => today.toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    total_amount: 0,
    total_delivery_fee: 0,
    establishments: []
  });
  const [error, setError] = useState('');
  const { unreadCount: unreadNotifications } = useNotifications();
  const [todayFaturamento, setTodayFaturamento] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);

  const navigate = useNavigate();

  // Buscar dados para o rodapé
  const fetchFooterData = async () => {
    try {
      // Buscar faturamento do dia
      const response = await api.get('/orders/history');
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = response.data.filter((order: any) => 
        order.finished_at && order.finished_at.startsWith(today)
      );
      const total = todayOrders.reduce((sum: number, order: any) => 
        sum + Number(order.delivery_fee || 0), 0
      );
      setTodayFaturamento(total);

      // Buscar pedidos ativos
      const activeResponse = await api.get('/orders/active');
      setActiveOrders(activeResponse.data.length);
    } catch (err) {
      setTodayFaturamento(0);
      setActiveOrders(0);
    }
  };

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchEarnings = async () => {
    setError('');
    // Validação do intervalo
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 0) {
      setError('A data inicial deve ser menor ou igual à data final.');
      return;
    }
    if (diff > MAX_DAYS_RANGE - 1) {
      setError('O intervalo máximo permitido é de 31 dias.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/earnings-range?start_date=${startDate}&end_date=${endDate}`);
      setData(response.data);
    } catch (err) {
      setData({ total_amount: 0, total_delivery_fee: 0, establishments: [] });
      setError('Erro ao buscar dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 pb-24">
      <h1 className="text-xl md:text-2xl font-bold mb-3">Faturamento por Estabelecimento</h1>
      <div className="bg-green-500 text-white rounded-xl p-4 md:p-5 mb-5 flex flex-col items-center min-h-[110px] md:min-h-[120px] justify-center">
        <span className="text-base md:text-lg font-semibold">Total de Taxas do Período</span>
        <span className="text-2xl md:text-3xl font-bold">R$ {Number(data.total_delivery_fee).toFixed(2)}</span>
        <span className="text-xs md:text-sm mt-1">Taxas de entrega do período selecionado</span>
      </div>
      <div className="bg-white rounded-lg shadow p-3 mb-4">
        <label className="block mb-2 font-medium text-sm text-gray-800 text-center">Intervalo de datas <span className='text-gray-400'>(máx. 31 dias)</span>:</label>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-2">
          <input
            type="date"
            value={startDate}
            max={endDate}
            onChange={e => setStartDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-green-200 focus:border-green-400 transition w-full md:w-32 shadow-sm"
            aria-label="Data inicial"
          />
          <span className="mx-1 text-base font-bold text-gray-300 hidden md:inline">—</span>
          <span className="mx-1 text-xs text-gray-400 md:hidden">até</span>
          <input
            type="date"
            value={endDate}
            min={startDate}
            max={today.toISOString().slice(0, 10)}
            onChange={e => setEndDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-green-200 focus:border-green-400 transition w-full md:w-32 shadow-sm"
            aria-label="Data final"
          />
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1.5 rounded-lg shadow-sm transition text-sm ml-0 md:ml-2 mt-2 md:mt-0 focus:outline-none focus:ring-1 focus:ring-green-300"
            onClick={fetchEarnings}
          >Filtrar</button>
        </div>
        {error && <div className="text-red-600 text-xs mt-2 text-center">{error}</div>}
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Estabelecimentos com entregas</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : data.establishments.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Nenhuma entrega no período</p>
            <p>Você ainda não realizou nenhuma entrega neste intervalo.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">Estabelecimento</th>
                <th className="py-2">Total Taxas</th>
              </tr>
            </thead>
            <tbody>
              {data.establishments.map((est: any) => (
                <tr
                  key={est.establishment_id}
                  className="border-t cursor-pointer hover:bg-gray-100"
                  onClick={() => navigate(`/faturamento/estabelecimento/${est.establishment_id}`)}
                >
                  <td className="py-2 font-medium">{est.establishment_name}</td>
                  <td className="py-2">R$ {Number(est.total_delivery_fee).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* FooterBar modernizado */}
      <FooterBar notifications={unreadNotifications} faturamento={todayFaturamento} activeOrders={activeOrders} />
    </div>
  );
};

export default Faturamento; 