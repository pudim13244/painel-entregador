import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';

const Faturamento = () => {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    total_amount: 0,
    total_delivery_fee: 0,
    establishments: []
  });

  const navigate = useNavigate();

  const fetchEarnings = async (selectedDate: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/daily-earnings?date=${selectedDate}`);
      setData(response.data);
    } catch (err) {
      setData({ total_amount: 0, total_delivery_fee: 0, establishments: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings(date);
  }, [date]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Faturamento por Estabelecimento</h1>
      <div className="bg-green-500 text-white rounded-lg p-6 mb-6 flex flex-col items-center">
        <span className="text-lg font-semibold">Total do Dia</span>
        <span className="text-3xl font-bold">R$ {Number(data.total_amount).toFixed(2)}</span>
        <span className="text-sm mt-1">Faturamento de hoje</span>
      </div>
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <label className="block mb-2 font-medium">Selecione uma data:</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border rounded px-3 py-2 mr-2"
        />
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded"
          onClick={() => fetchEarnings(date)}
        >Filtrar</button>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Estabelecimentos com entregas</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : data.establishments.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Nenhuma entrega hoje</p>
            <p>Você ainda não realizou nenhuma entrega nesta data.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">Estabelecimento</th>
                <th className="py-2">Total Pedidos</th>
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
                  <td className="py-2">{est.total_orders}</td>
                  <td className="py-2">R$ {Number(est.total_delivery_fee).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Faturamento; 