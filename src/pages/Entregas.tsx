import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Package, 
  Navigation,
  Phone,
  CheckCircle,
  Truck,
  ArrowLeft,
  RefreshCw,
  X,
  Store,
  User,
  Home
} from "lucide-react";
import api from "@/services/api";
import { toast } from 'sonner';
import { useAuth } from "@/contexts/AuthContext";

const Entregas = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deliveryPerson, setDeliveryPerson] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchActiveOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders/active');
      setActiveOrders(response.data);
    } catch (err) {
      console.error('Erro ao buscar pedidos ativos:', err);
      setActiveOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔑 [ENTREGAS] Token presente:', token ? 'Sim' : 'Não');
      if (token) {
        console.log('🔑 [ENTREGAS] Token:', token.substring(0, 20) + '...');
      }
      
      const response = await api.get('/profile');
      setDeliveryPerson(response.data);
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
    }
  };

  const handleFinishOrder = async (orderId: number) => {
    try {
      console.log(`🚚 [FRONTEND] Tentando finalizar pedido ${orderId}`);
      const response = await api.post(`/orders/${orderId}/finish`);
      console.log(`✅ [FRONTEND] Pedido ${orderId} finalizado com sucesso:`, response.data);
      toast.success("Entrega finalizada com sucesso!");
      fetchActiveOrders();
      setShowModal(false);
      setSelectedOrder(null);
    } catch (err: any) {
      console.error(`❌ [FRONTEND] Erro ao finalizar pedido ${orderId}:`, err);
      console.error(`❌ [FRONTEND] Resposta do servidor:`, err.response?.data);
      
      if (err.response?.status === 403) {
        const debug = err.response?.data?.debug;
        if (debug) {
          console.error(`🔍 [FRONTEND] Debug info:`, debug);
          
          // Verificar se o pedido já foi finalizado
          if (debug.orderStatus === 'DELIVERED') {
            toast.error("Este pedido já foi finalizado anteriormente. Atualize a lista para ver os pedidos atuais.");
          } else {
            toast.error(`Erro: ${err.response.data.message}. Verifique se o pedido está atribuído a você.`);
          }
        } else {
          toast.error("Erro: Pedido não pode ser finalizado. Verifique se está atribuído a você.");
        }
      } else if (err.response?.status === 400) {
        const errorData = err.response?.data;
        console.error(`❌ [FRONTEND] Erro 400 detalhado:`, errorData);
        
        if (errorData?.missingFields) {
          toast.error(`Dados incompletos: ${errorData.missingFields.join(', ')}`);
        } else {
          toast.error(`Erro de validação: ${errorData?.message || 'Dados inválidos'}`);
        }
      } else if (err.response?.status === 500) {
        const errorData = err.response?.data;
        console.error(`❌ [FRONTEND] Erro 500 detalhado:`, errorData);
        toast.error(`Erro interno do servidor: ${errorData?.error || 'Erro desconhecido'}`);
      } else {
        toast.error("Erro ao finalizar entrega");
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleCardClick = (order: any) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    fetchActiveOrders();
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Minhas Entregas</h1>
              <p className="text-sm text-gray-600">Pedidos em andamento</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchActiveOrders}
              disabled={loading}
              className="hover:bg-blue-50 hover:border-blue-200 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Atualizando...' : 'Atualizar'}
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2 text-gray-500">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Carregando entregas...</span>
            </div>
          </div>
        ) : activeOrders.length === 0 ? (
          <div className="text-center py-12">
            <Truck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-600 mb-2">Nenhuma entrega em andamento</h4>
            <p className="text-gray-500">Você não possui pedidos ativos no momento</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <Card 
                key={order.id} 
                className="border-2 border-blue-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 cursor-pointer"
                onClick={() => handleCardClick(order)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="font-bold text-xl text-blue-800">#{order.id}</span>
                      <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                        Em Andamento
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-600">Cliente</div>
                      <div className="font-semibold text-gray-800">{order.customer_name}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{order.customer_phone}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span className="text-sm text-gray-600">{order.endereco}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{order.establishment_name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Criado em: {order.created_at ? new Date(order.created_at).toLocaleString() : '-'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-blue-100 text-blue-800 font-semibold text-base shadow">
                      {order.payment_method === 'CASH' ? 'Dinheiro' : 
                       order.payment_method === 'CREDIT' ? 'Cartão de Crédito' : 
                       order.payment_method === 'DEBIT' ? 'Cartão de Débito' : 
                       order.payment_method === 'PIX' ? 'PIX' : order.payment_method}
                    </Badge>
                    {order.change_amount !== undefined && order.change_amount !== null && Number(order.change_amount) > 0 && (
                      <Badge className="bg-green-100 text-green-800 font-semibold text-base shadow">
                        Troco: R$ {Number(order.change_amount).toFixed(2).replace('.', ',')}
                      </Badge>
                    )}
                    <Badge className="bg-green-100 text-green-800 font-semibold text-base shadow">
                      {formatCurrency(Number(order.delivery_fee || 3))}
                    </Badge>
                  </div>
                  
                  <Button
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-300 hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFinishOrder(order.id);
                    }}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Finalizar Entrega
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white relative">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Detalhes do Pedido #{selectedOrder.id}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              {/* Informações do Cliente */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Informações do Cliente
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Nome:</span>
                    <span className="font-medium text-gray-800">{selectedOrder.customer_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Telefone:</span>
                    <span className="font-medium text-gray-800">{selectedOrder.customer_phone}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Home className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <span className="text-sm text-gray-600">Endereço:</span>
                      <div className="font-medium text-gray-800">{selectedOrder.endereco}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações do Estabelecimento */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Store className="h-5 w-5 mr-2 text-green-600" />
                  Informações do Estabelecimento
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Store className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Nome:</span>
                    <span className="font-medium text-gray-800">{selectedOrder.establishment_name}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <span className="text-sm text-gray-600">Endereço:</span>
                      <div className="font-medium text-gray-800">{selectedOrder.establishment_address || 'Endereço não informado'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações do Pedido */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-orange-600" />
                  Informações do Pedido
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Criado em:</span>
                    <span className="font-medium text-gray-800">
                      {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : '-'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Valor do pedido:</span>
                    <span className="font-medium text-gray-800">
                      {selectedOrder.value ? formatCurrency(Number(selectedOrder.value)) : 'Não informado'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Taxa de entrega:</span>
                    <span className="font-medium text-gray-800">
                      {formatCurrency(Number(selectedOrder.delivery_fee || 3))}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="font-bold text-lg text-green-600">
                      {formatCurrency(Number(selectedOrder.value || 0) + Number(selectedOrder.delivery_fee || 3))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Método de Pagamento */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-purple-600" />
                  Pagamento
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Método:</span>
                    <Badge className="bg-blue-100 text-blue-800 font-semibold">
                      {selectedOrder.payment_method === 'CASH' ? 'Dinheiro' : 
                       selectedOrder.payment_method === 'CREDIT' ? 'Cartão de Crédito' : 
                       selectedOrder.payment_method === 'DEBIT' ? 'Cartão de Débito' : 
                       selectedOrder.payment_method === 'PIX' ? 'PIX' : selectedOrder.payment_method}
                    </Badge>
                  </div>
                  {selectedOrder.change_amount !== undefined && selectedOrder.change_amount !== null && Number(selectedOrder.change_amount) > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Troco:</span>
                      <Badge className="bg-green-100 text-green-800 font-semibold">
                        R$ {Number(selectedOrder.change_amount).toFixed(2).replace('.', ',')}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Botão Finalizar */}
              <Button
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-300 hover:scale-105"
                onClick={() => handleFinishOrder(selectedOrder.id)}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Finalizar Entrega
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Entregas; 