import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { ArrowLeft, Download } from 'lucide-react';

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

  useEffect(() => {
    fetchOrders(date);
    // eslint-disable-next-line
  }, [date, id]);

  // Totais
  const totalPedidos = orders.length;
  const totalValor = orders.reduce((sum: number, o: any) => sum + (Number(o.total_amount) || 0), 0);
  const totalTaxas = orders.reduce((sum: number, o: any) => sum + (Number(o.delivery_fee) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header simples */}
      <header className="w-full bg-white border-b shadow-sm px-4 py-4 flex items-center gap-4">
        <button
          className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-2 py-1 rounded"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" /> Voltar
        </button>
        <h1 className="text-lg md:text-xl font-bold text-gray-800 flex-1 truncate">
          Faturamento: {establishmentName}
        </h1>
      </header>

      {/* Cards de totais simples */}
      <div className="max-w-2xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 px-4">
        <div className="bg-white rounded-lg border p-4 flex flex-col items-center">
          <span className="text-gray-600 text-sm">Pedidos</span>
          <span className="text-xl font-bold text-blue-700 mt-1">{totalPedidos}</span>
        </div>
        <div className="bg-white rounded-lg border p-4 flex flex-col items-center">
          <span className="text-gray-600 text-sm">Valor Total</span>
          <span className="text-xl font-bold text-green-700 mt-1">R$ {totalValor.toFixed(2)}</span>
        </div>
        <div className="bg-white rounded-lg border p-4 flex flex-col items-center">
          <span className="text-gray-600 text-sm">Taxas</span>
          <span className="text-xl font-bold text-yellow-700 mt-1">R$ {totalTaxas.toFixed(2)}</span>
        </div>
      </div>

      {/* Filtro e tabela */}
      <main className="flex-1 max-w-2xl w-full mx-auto mt-8 px-4">
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <div className="flex-1">
            <label className="block font-medium mb-1 text-gray-700">Data:</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full md:w-auto"
            />
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded mt-2 md:mt-0"
            onClick={() => fetchOrders(date)}
          >Filtrar</button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-5 py-2 rounded mt-2 md:mt-0"
            onClick={() => alert('Solicitação de recebimento enviada!')}
          >Solicitar recebimento</button>
        </div>
        <div className="bg-white rounded-lg border p-0 md:p-4 overflow-x-auto">
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
                  <th className="py-2 px-2 text-sm font-bold text-gray-700">Valor</th>
                  <th className="py-2 px-2 text-sm font-bold text-gray-700">Taxa</th>
                  <th className="py-2 px-2 text-sm font-bold text-gray-700">Entregador</th>
                  <th className="py-2 px-2 rounded-tr-lg text-sm font-bold text-gray-700">Data/Hora</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.order_id} className="bg-white hover:bg-blue-50 transition rounded-lg">
                    <td className="py-2 px-2 font-medium">{order.order_id}</td>
                    <td className="py-2 px-2">R$ {Number(order.total_amount).toFixed(2)}</td>
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
    </div>
  );
};

export default FaturamentoEstabelecimento; 