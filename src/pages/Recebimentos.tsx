import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { useNotifications } from '@/hooks/useNotifications';
import { Package, DollarSign, Truck, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Pedido {
  id: number;
  order_id: string;
  establishment_id: number;
  customer_name: string;
  delivery_fee: number;
  taxa_recebida: number;
  finished_at: string;
}

interface Estabelecimento {
  id: number;
  name: string;
}

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

const Recebimentos = () => {
  const navigate = useNavigate();
  const { unreadCount: unreadNotifications } = useNotifications();
  const [activeTab, setActiveTab] = useState<'nao-recebido' | 'recebido'>('nao-recebido');
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEstabelecimento, setSelectedEstabelecimento] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPedidos, setSelectedPedidos] = useState<number[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [codigoConfirmacao, setCodigoConfirmacao] = useState('');
  const [todayFaturamento, setTodayFaturamento] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);

  // Calcular valor total dos pedidos selecionados
  const totalSelecionado = pedidos
    .filter(p => selectedPedidos.includes(p.id))
    .reduce((sum, p) => sum + Number(p.delivery_fee), 0);

  // Buscar pedidos
  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: activeTab,
        ...(selectedEstabelecimento && { estabelecimento_id: selectedEstabelecimento }),
        ...(searchQuery && { q: searchQuery })
      });
      const response = await api.get(`/recebimentos/pedidos?${params}`);
      setPedidos(response.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar estabelecimentos
  const fetchEstabelecimentos = async () => {
    try {
      const response = await api.get('/establishments');
      setEstabelecimentos(response.data);
    } catch (error) {
      console.error('Erro ao buscar estabelecimentos:', error);
    }
  };

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
    fetchEstabelecimentos();
    fetchFooterData();
  }, []);

  useEffect(() => {
    fetchPedidos();
    setSelectedPedidos([]);
  }, [activeTab, selectedEstabelecimento, searchQuery]);

  // Selecionar/deselecionar pedido
  const togglePedido = (pedidoId: number) => {
    setSelectedPedidos(prev => 
      prev.includes(pedidoId) 
        ? prev.filter(id => id !== pedidoId)
        : [...prev, pedidoId]
    );
  };

  // Selecionar todos os pedidos não recebidos
  const selectAll = () => {
    if (activeTab === 'nao-recebido') {
      const naoRecebidos = pedidos.filter(p => p.taxa_recebida === 0);
      setSelectedPedidos(naoRecebidos.map(p => p.id));
    }
  };

  // Desmarcar todos
  const deselectAll = () => {
    setSelectedPedidos([]);
  };

  // Solicitar recebimento
  const solicitarRecebimento = async () => {
    if (selectedPedidos.length === 0) {
      alert('Selecione pelo menos um pedido');
      return;
    }

    setConfirming(true);
    try {
      const response = await api.post('/recebimentos/solicitar', {
        pedidos_ids: selectedPedidos
      });
      
      setCodigoConfirmacao(response.data.codigo);
      setShowConfirmModal(true);
      setSelectedPedidos([]);
      fetchPedidos(); // Atualizar lista
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao solicitar recebimento');
    } finally {
      setConfirming(false);
    }
  };

  // Confirmar recebimento
  const confirmarRecebimento = async () => {
    if (!codigoConfirmacao) {
      alert('Código de confirmação é obrigatório');
      return;
    }

    setConfirming(true);
    try {
      await api.post('/recebimentos/confirmar', {
        recebimento_id: 1, // Ajustar conforme necessário
        codigo: codigoConfirmacao
      });
      
      alert('Recebimento confirmado com sucesso!');
      setShowConfirmModal(false);
      setCodigoConfirmacao('');
      fetchPedidos();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao confirmar recebimento');
    } finally {
      setConfirming(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Recebimentos</h1>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Voltar
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estabelecimento
            </label>
            <select
              value={selectedEstabelecimento}
              onChange={(e) => setSelectedEstabelecimento(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Todos os estabelecimentos</option>
              {estabelecimentos.map(est => (
                <option key={est.id} value={est.id}>{est.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              placeholder="ID, nome do cliente ou data"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="flex items-end">
            <div className="flex space-x-2">
              <button
                onClick={selectAll}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Selecionar Todos
              </button>
              <button
                onClick={deselectAll}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('nao-recebido')}
            className={`flex-1 px-4 py-3 text-center font-medium transition ${
              activeTab === 'nao-recebido'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Não Recebidos ({pedidos.filter(p => p.taxa_recebida === 0).length})
          </button>
          <button
            onClick={() => setActiveTab('recebido')}
            className={`flex-1 px-4 py-3 text-center font-medium transition ${
              activeTab === 'recebido'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Recebidos ({pedidos.filter(p => p.taxa_recebida === 1).length})
          </button>
        </div>

        {/* Lista de Pedidos */}
        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando...</p>
            </div>
          ) : pedidos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum pedido encontrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pedidos.map(pedido => (
                <div
                  key={pedido.id}
                  className={`border rounded-lg p-4 transition ${
                    activeTab === 'nao-recebido' && pedido.taxa_recebida === 0
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {activeTab === 'nao-recebido' && (
                        <input
                          type="checkbox"
                          checked={selectedPedidos.includes(pedido.id)}
                          onChange={() => togglePedido(pedido.id)}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            Pedido #{pedido.order_id}
                          </span>
                          <span className="text-sm text-gray-500">
                            {pedido.customer_name}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDate(pedido.finished_at)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(pedido.delivery_fee)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Taxa de entrega
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Total e Botão Solicitar */}
      {activeTab === 'nao-recebido' && selectedPedidos.length > 0 && (
        <div className="bg-green-500 text-white rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Total Selecionado</div>
              <div className="text-2xl font-bold">{formatCurrency(totalSelecionado)}</div>
              <div className="text-sm opacity-90">
                {selectedPedidos.length} pedido{selectedPedidos.length > 1 ? 's' : ''} selecionado{selectedPedidos.length > 1 ? 's' : ''}
              </div>
            </div>
            
            <button
              onClick={solicitarRecebimento}
              disabled={confirming}
              className="px-6 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            >
              {confirming ? 'Solicitando...' : 'Solicitar Recebimento'}
            </button>
          </div>
        </div>
      )}

      {/* FooterBar modernizado */}
      <FooterBar notifications={unreadNotifications} faturamento={todayFaturamento} activeOrders={activeOrders} />

      {/* Modal de Confirmação */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Código de Confirmação</h3>
            <p className="text-gray-600 mb-4">
              Use este código para confirmar o recebimento quando o pagamento for realizado:
            </p>
            
            <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-800 mb-2">
                  {codigoConfirmacao}
                </div>
                <div className="text-sm text-green-600">
                  Código de confirmação
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Fechar
              </button>
              <button
                onClick={confirmarRecebimento}
                disabled={confirming}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
              >
                {confirming ? 'Confirmando...' : 'Confirmar Recebimento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recebimentos; 