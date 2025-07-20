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
  RefreshCw
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
                className="border-2 border-blue-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50"
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
                    onClick={() => handleFinishOrder(order.id)}
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
    </div>
  );
};

export default Entregas; 