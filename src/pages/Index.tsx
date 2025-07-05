import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  User, 
  MapPin, 
  Clock, 
  DollarSign, 
  Package, 
  Navigation,
  Phone,
  Star,
  History,
  CheckCircle,
  AlertCircle,
  Mail,
  IdCard,
  Truck,
  Car,
  Bike,
  KeyRound,
  Camera,
  LogOut,
  Edit2,
  Save,
  RefreshCw
} from "lucide-react";
import api, { fetchDeliveryProfile, updateDeliveryProfile } from "@/services/api";
import { toast } from 'sonner';
import { useAuth } from "@/contexts/AuthContext";
import { PWAStatus } from "@/components/PWAStatus";
import { useNotifications } from "@/hooks/useNotifications";
import { useOrderOffers } from "@/hooks/useOrderOffers";
import { OrderOfferModal } from "@/components/OrderOfferModal";

const Index = () => {
  const { user, logout } = useAuth();
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [deliveryPerson, setDeliveryPerson] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(() => {
    const saved = localStorage.getItem('isAvailable');
    return saved ? JSON.parse(saved) : false;
  });
  const [currentScreen, setCurrentScreen] = useState("dashboard");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: deliveryPerson?.name || "",
    email: deliveryPerson?.email || "",
    cpf: deliveryPerson?.cpf || "",
    phone: deliveryPerson?.phone || "",
    vehicle_type: deliveryPerson?.vehicle_type || "",
    vehicle_model: deliveryPerson?.vehicle_model || "",
    has_plate: deliveryPerson?.has_plate || false,
    plate: deliveryPerson?.plate || "",
    photo_url: deliveryPerson?.photo_url || "",
  });
  const [todayFaturamento, setTodayFaturamento] = useState(0);
  const { unreadCount: unreadNotifications, fetchUnreadCount } = useNotifications();
  const { 
    currentOffer, 
    timeLeft, 
    isTimerActive, 
    acceptOffer, 
    rejectOffer 
  } = useOrderOffers();

  // Sempre que mudar, salva no localStorage
  useEffect(() => {
    localStorage.setItem('isAvailable', JSON.stringify(isAvailable));
  }, [isAvailable]);

  // Buscar pedidos disponíveis (apenas quando disponível)
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get('/orders/available');
        setPendingOrders(response.data);
      } catch (err) {
        setPendingOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAvailable) {
      fetchOrders(); // Busca apenas uma vez quando fica disponível
    } else {
      setPendingOrders([]);
    }
  }, [isAvailable]);

  // Buscar pedidos em andamento
  useEffect(() => {
    const fetchActiveOrders = async () => {
      try {
        const response = await api.get('/orders/active');
        // Filtrar apenas pedidos atribuídos ao entregador logado
        const filteredOrders = response.data.filter((order: any) => {
          const isAssignedToUser = Number(order.delivery_id) === user?.id;
          console.log(`Pedido ${order.id}: delivery_id=${order.delivery_id}, user.id=${user?.id}, isAssigned=${isAssignedToUser}`);
          return isAssignedToUser;
        });
        setActiveOrders(filteredOrders);
      } catch (err) {
        setActiveOrders([]);
      }
    };
    if (isAvailable && user?.id) {
      fetchActiveOrders();
    } else {
      setActiveOrders([]);
    }
  }, [isAvailable, pendingOrders, user?.id]);

  // Buscar perfil do entregador ao carregar
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchDeliveryProfile();
        setDeliveryPerson(data);
      } catch (err) {
        setDeliveryPerson(null);
      }
    };
    fetchProfile();
    fetchTodayFaturamento();
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Buscar histórico de entregas ao abrir a tela de histórico
  useEffect(() => {
    if (currentScreen === "history") {
      const fetchHistory = async () => {
        try {
          const response = await api.get('/orders/history');
          setHistory(response.data);
        } catch (err) {
          setHistory([]);
        }
      };
      fetchHistory();
    }
  }, [currentScreen]);

  useEffect(() => {
    setForm({
      name: deliveryPerson?.name || "",
      email: deliveryPerson?.email || "",
      cpf: deliveryPerson?.cpf || "",
      phone: deliveryPerson?.phone || "",
      vehicle_type: deliveryPerson?.vehicle_type || "",
      vehicle_model: deliveryPerson?.vehicle_model || "",
      has_plate: deliveryPerson?.has_plate || false,
      plate: deliveryPerson?.plate || "",
      photo_url: deliveryPerson?.photo_url || "",
    });
  }, [deliveryPerson]);



  const fetchTodayFaturamento = async () => {
    try {
      const response = await api.get('/orders/history');
      const allOrders = response.data;

      // Filtrar apenas pedidos de hoje
      const today = new Date();
      const todayOrders = allOrders.filter((order: any) => {
        const orderDate = new Date(order.date);
        return (
          orderDate.getDate() === today.getDate() &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        );
      });

      // Calcular total de taxas de entrega do dia
      const totalFees = todayOrders.reduce((sum: number, order: any) => sum + (order.earning || 0), 0);
      setTodayFaturamento(totalFees);
    } catch (error) {
      console.error('Erro ao buscar faturamento:', error);
    }
  };



  // Função para checar se o perfil está completo
  function isProfileComplete(formData = form) {
    return !!(
      formData.name &&
      formData.email &&
      formData.cpf &&
      formData.phone &&
      formData.vehicle_type &&
      (formData.vehicle_type === 'bicicleta' || formData.vehicle_model) &&
      (!formData.has_plate || (formData.has_plate && formData.plate))
    );
  }

  // Função para listar campos faltantes
  function getCamposFaltando(form: any) {
    const faltando = [];
    if (!form.name) faltando.push('Nome');
    if (!form.email) faltando.push('E-mail');
    if (!form.cpf) faltando.push('CPF');
    if (!form.phone) faltando.push('Telefone');
    if (!form.vehicle_type) faltando.push('Tipo de veículo');
    if (form.vehicle_type !== 'bicicleta' && !form.vehicle_model) faltando.push('Modelo do veículo');
    if (form.has_plate && !form.plate) faltando.push('Placa do veículo');
    return faltando;
  }

  // Função para atualizar manualmente os pedidos disponíveis
  const refreshOrders = async () => {
    if (!isAvailable) return;
    
    setLoading(true);
    try {
      const response = await api.get('/orders/available');
      setPendingOrders(response.data);
      toast.success('Pedidos atualizados!');
    } catch (err) {
      setPendingOrders([]);
      toast.error('Erro ao atualizar pedidos');
    } finally {
      setLoading(false);
    }
  };

  // Modificar o handler do Switch de disponibilidade
  const handleAvailabilityChange = (checked: boolean) => {
    if (checked && !isProfileComplete()) {
      setShowProfileAlert(true);
      return;
    }
    setIsAvailable(checked);
  };

  // Tela de Login
  const LoginScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">
            QuickEntregadores
          </CardTitle>
          <p className="text-muted-foreground">Entre na sua conta</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="********" />
          </div>
          <Button 
            className="w-full" 
            onClick={() => navigate('/login')}
          >
            Entrar
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Dashboard Principal
  const Dashboard = () => {
    console.log('activeOrders:', activeOrders);
    console.log('photo_url dashboard:', deliveryPerson?.photo_url);
    return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
              <Avatar onClick={() => setCurrentScreen("profile")}
                className="cursor-pointer hover:opacity-80 transition">
                <AvatarImage src={deliveryPerson?.photo_url ? deliveryPerson.photo_url.replace('uc?id=', 'uc?export=view&id=') : "/placeholder.svg"} />
                <AvatarFallback>{deliveryPerson?.name?.[0] || "DR"}</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="font-semibold">{deliveryPerson?.name || "Entregador"}</h2>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{deliveryPerson?.rating !== undefined ? deliveryPerson.rating : "-"}</span>
                <span>•</span>
                  <span>{deliveryPerson?.totalDeliveries !== undefined ? `${deliveryPerson.totalDeliveries} entregas` : "- entregas"}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm">
              {isAvailable ? "Disponível" : "Indisponível"}
            </span>
            <Switch 
              checked={isAvailable} 
                onCheckedChange={handleAvailabilityChange}
            />
          </div>
        </div>
      </div>

        <AlertDialog open={showProfileAlert} onOpenChange={setShowProfileAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Perfil Incompleto</AlertDialogTitle>
              <AlertDialogDescription>
                Para começar a receber pedidos, você precisa preencher seu perfil completamente.
              </AlertDialogDescription>
              <div style={{ margin: '8px 0' }}>
                <b>Campos obrigatórios faltando:</b>
                <ul style={{ marginTop: 8, marginBottom: 8 }}>
                  {getCamposFaltando(form).map((campo) => (
                    <li key={campo}>• {campo}</li>
                  ))}
                </ul>
                Por favor, complete as informações necessárias no seu perfil.
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => {
                setShowProfileAlert(false);
                setCurrentScreen("profile");
              }}>
                Ir para o Perfil
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      {/* Ganhos */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Hoje</p>
                    <p className="text-xl font-semibold">R$ {(deliveryPerson?.todayEarnings ?? 0).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Esta semana</p>
                    <p className="text-xl font-semibold">R$ {(deliveryPerson?.weekEarnings ?? 0).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pedidos Pendentes */}
          {isAvailable ? (
            <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Pedidos Disponíveis
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={refreshOrders}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Atualizando...' : 'Atualizar'}
              </Button>
            </div>
              {loading ? (
                <div>Carregando pedidos...</div>
              ) : pendingOrders.length === 0 ? (
                <div>Nenhum pedido disponível no momento.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingOrders.map((order) => (
                    <Card key={order.pedido_id} className="border-green-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-lg">Pedido #{order.pedido_id}</span>
                          <Badge variant="secondary">Disponível</Badge>
                        </div>
                        <div className="mb-2">
                          <strong>Cliente:</strong> {order.cliente}<br />
                          <strong>Telefone:</strong> {order.telefone}<br />
                          <strong>Endereço:</strong> {order.endereco}<br />
                          <strong>Estabelecimento:</strong> {order.estabelecimento}<br />
                          <strong>Retirada:</strong> {order.retirada}<br />
                          <strong>Data:</strong> {order.data ? new Date(order.data).toLocaleString() : '-'}
                        </div>
                        <Button
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => handleAcceptOrder(order.pedido_id)}
                        >
                          Aceitar Entrega
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <span className="text-2xl mb-2">Você está indisponível</span>
              <span>Ative sua disponibilidade para receber pedidos</span>
            </div>
          )}

          {/* Pedidos em Andamento */}
          {isAvailable && activeOrders.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Pedidos em Andamento
              </h3>
              <div className="space-y-3">
                {activeOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="border-green-500 cursor-pointer hover:shadow-lg transition"
                    onClick={async () => {
                      try {
                        const response = await api.get(`/orders/${order.id}`);
                        setSelectedOrder(response.data);
                        setCurrentScreen("orderDetails");
                      } catch (err) {
                        toast.error("Erro ao buscar detalhes do pedido");
                      }
                    }}
                  >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                          <h4 className="font-semibold">{order.establishment_name}</h4>
                          <p className="text-sm text-muted-foreground">{order.endereco}</p>
                      </div>
                        <Badge variant="secondary">Cliente: {order.customer_name}</Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                        <span>{order.endereco}</span>
                      <Clock className="h-4 w-4 ml-3 mr-1" />
                        <span>{order.created_at ? new Date(order.created_at).toLocaleString() : '-'}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge className="bg-blue-100 text-blue-800 font-semibold text-base shadow">{order.payment_method === 'CASH' ? 'Dinheiro' : order.payment_method === 'CREDIT' ? 'Cartão de Crédito' : order.payment_method === 'DEBIT' ? 'Cartão de Débito' : order.payment_method === 'PIX' ? 'PIX' : order.payment_method}</Badge>
                        {order.change_amount !== undefined && order.change_amount !== null && Number(order.change_amount) > 0 && (
                          <Badge className="bg-green-100 text-green-800 font-semibold text-base shadow">Troco: R$ {Number(order.change_amount).toFixed(2).replace('.', ',')}</Badge>
                        )}
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm">Telefone: {order.customer_phone}</span>
                      <Button 
                        size="sm"
                          className="ml-4"
                          onClick={e => {
                            e.stopPropagation(); // Para não abrir detalhes ao finalizar entrega
                            handleFinishOrder(order.id);
                        }}
                      >
                          Finalizar Entrega
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Botão para Histórico */}
        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setCurrentScreen("history")}
          >
            <History className="h-4 w-4 mr-2" />
            Ver Histórico de Entregas
          </Button>
        </div>
      </div>
      {/* Rodapé fixo apenas na home */}
      <FooterBar notifications={unreadNotifications} faturamento={todayFaturamento} activeOrders={activeOrders?.length || 0} />
    </div>
  );
  };

  // Detalhes do Pedido / Restaurante
  const OrderDetails = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setCurrentScreen("dashboard")}
          >
            ← Voltar
          </Button>
          <h2 className="text-lg font-semibold">Detalhes do Pedido</h2>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Informações do Restaurante */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              {selectedOrder?.restaurant}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                {selectedOrder?.restaurantAddress}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                (11) 99999-9999
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mapa do Restaurante */}
        <Card>
          <CardContent className="p-4">
            <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p>Mapa do Restaurante</p>
                <p className="text-sm">Localização: {selectedOrder?.restaurantAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Itens do Pedido */}
        <Card>
          <CardHeader>
            <CardTitle>Itens do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedOrder?.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center font-semibold">
                <span>Total:</span>
                <span>R$ {selectedOrder?.value ? Number(selectedOrder.value).toFixed(2) : '0,00'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="space-y-3">
          <Button 
            className="w-full"
            onClick={() => setCurrentScreen("collected")}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Ir para o Restaurante
          </Button>
        </div>
      </div>
    </div>
  );

  // Tela de Pedido Coletado
  const CollectedScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4">
        <h2 className="text-lg font-semibold text-center">Coletando Pedido</h2>
      </div>

      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chegou ao restaurante?</h3>
            <p className="text-muted-foreground mb-6">
              Confirme quando coletar o pedido #{selectedOrder?.id}
            </p>
            <Button 
              className="w-full"
              onClick={() => setCurrentScreen("delivery")}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Pedido Coletado
            </Button>
          </CardContent>
        </Card>

        {/* Info do Cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Entregar para:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="font-semibold">{selectedOrder?.customerName}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder?.customerAddress}</p>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{selectedOrder?.distance} de distância</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Tela de Entrega
  const DeliveryScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4">
        <h2 className="text-lg font-semibold text-center">Entregando Pedido</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Mapa do Cliente */}
        <Card>
          <CardContent className="p-4">
            <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p>Mapa do Cliente</p>
                <p className="text-sm">Destino: {selectedOrder?.customerAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações do Cliente */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold">{selectedOrder?.customerName}</h3>
                <p className="text-sm text-muted-foreground">{selectedOrder?.customerAddress}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Ligar
                </Button>
                <Button variant="outline" size="sm">
                  <Navigation className="h-4 w-4 mr-2" />
                  Navegar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão de Entrega */}
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chegou ao destino?</h3>
            <p className="text-muted-foreground mb-6">
              Confirme a entrega do pedido #{selectedOrder?.id}
            </p>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={async () => {
                await handleFinishOrder(selectedOrder.id);
                setCurrentScreen("dashboard");
                setSelectedOrder(null);
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Pedido Entregue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Funções utilitárias para filtro de datas
  function isToday(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  function isThisWeek(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const firstDayOfWeek = new Date(now);
    firstDayOfWeek.setDate(now.getDate() - now.getDay());
    firstDayOfWeek.setHours(0, 0, 0, 0);
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);
    return date >= firstDayOfWeek && date <= lastDayOfWeek;
  }

  function isThisMonth(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  // Histórico de Entregas
  const HistoryScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setCurrentScreen("dashboard")}
          >
            ← Voltar
          </Button>
          <h2 className="text-lg font-semibold">Histórico de Entregas</h2>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Hoje</TabsTrigger>
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="month">Mês</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-4 mt-4">
            {history.filter(delivery => isToday(delivery.date)).length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Nenhuma entrega realizada hoje.</p>
                </CardContent>
              </Card>
            ) : (
              history.filter(delivery => isToday(delivery.date)).map((delivery) => (
              <Card key={delivery.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{delivery.restaurant}</h4>
                      <p className="text-sm text-muted-foreground">
                        Para: {delivery.customer}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                          +R$ {Number(delivery.earning).toFixed(2)}
                      </p>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm">{delivery.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Valor: R$ {Number(delivery.value).toFixed(2)}</span>
                      <span>{delivery.date ? new Date(delivery.date).toLocaleDateString() : '-'}</span>
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="week" className="space-y-4 mt-4">
            {history.filter(delivery => isThisWeek(delivery.date)).length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Nenhuma entrega realizada esta semana.</p>
              </CardContent>
            </Card>
            ) : (
              history.filter(delivery => isThisWeek(delivery.date)).map((delivery) => (
                <Card key={delivery.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{delivery.restaurant}</h4>
                        <p className="text-sm text-muted-foreground">
                          Para: {delivery.customer}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          +R$ {Number(delivery.earning).toFixed(2)}
                        </p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm">{delivery.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Valor: R$ {Number(delivery.value).toFixed(2)}</span>
                      <span>{delivery.date ? new Date(delivery.date).toLocaleDateString() : '-'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="month" className="space-y-4 mt-4">
            {history.filter(delivery => isThisMonth(delivery.date)).length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Nenhuma entrega realizada este mês.</p>
              </CardContent>
            </Card>
            ) : (
              history.filter(delivery => isThisMonth(delivery.date)).map((delivery) => (
                <Card key={delivery.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{delivery.restaurant}</h4>
                        <p className="text-sm text-muted-foreground">
                          Para: {delivery.customer}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          +R$ {Number(delivery.earning).toFixed(2)}
                        </p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm">{delivery.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Valor: R$ {Number(delivery.value).toFixed(2)}</span>
                      <span>{delivery.date ? new Date(delivery.date).toLocaleDateString() : '-'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  // Tela de Perfil do Entregador
  const ProfileScreen = () => {
    // Estado local do formulário para evitar re-renderizações
    const [formState, setFormState] = useState({
      name: "",
      email: "",
      cpf: "",
      phone: "",
      vehicle_type: "",
      vehicle_model: "",
      has_plate: false,
      plate: "",
      photo_url: "",
    });

    // Atualiza o estado local quando o perfil é carregado
    useEffect(() => {
      if (deliveryPerson) {
        setFormState({
          name: deliveryPerson.name || "",
          email: deliveryPerson.email || "",
          cpf: deliveryPerson.cpf || "",
          phone: deliveryPerson.phone || "",
          vehicle_type: deliveryPerson.vehicle_type || "",
          vehicle_model: deliveryPerson.vehicle_model || "",
          has_plate: deliveryPerson.has_plate || false,
          plate: deliveryPerson.plate || "",
          photo_url: deliveryPerson.photo_url || "",
        });
      }
    }, [deliveryPerson]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      e.preventDefault();
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;

      setFormState(prev => {
        const newState = {
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        };

        // Resetar campos relacionados quando mudar o tipo de veículo
        if (name === 'vehicle_type') {
          if (value === 'bicicleta') {
            newState.vehicle_model = '';
            newState.has_plate = false;
            newState.plate = '';
          } else {
            newState.has_plate = false;
            newState.plate = '';
          }
        }

        return newState;
      });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const updated = await updateDeliveryProfile(formState);
        // Garante que todos os campos obrigatórios estejam presentes
        const safeProfile = {
          name: updated?.name || formState.name,
          email: updated?.email || formState.email,
          cpf: updated?.cpf || formState.cpf,
          phone: updated?.phone || formState.phone,
          vehicle_type: updated?.vehicle_type || formState.vehicle_type,
          vehicle_model: updated?.vehicle_model || formState.vehicle_model,
          has_plate: updated?.has_plate ?? formState.has_plate,
          plate: updated?.plate || formState.plate || '',
          photo_url: updated?.photo_url || formState.photo_url || '',
        };
        setForm(safeProfile);
        if (isProfileComplete(safeProfile)) setShowProfileAlert(false);
        toast.success("Perfil atualizado com sucesso!");
        setEditMode(false);
      } catch (err) {
        toast.error("Erro ao atualizar perfil");
      }
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('photo', file);
      try {
        const token = localStorage.getItem('delivery_token');
        const response = await fetch('/upload/profile-photo', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const data = await response.json();
        if (data.url) {
          setFormState(prev => ({
            ...prev,
            photo_url: data.url || '',
          }));
          toast.success('Foto enviada com sucesso!');
        } else {
          toast.error('Erro ao enviar foto');
        }
      } catch (err) {
        toast.error('Erro ao enviar foto');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center py-8 px-2">
        <PWAStatus />
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 relative">
          <form onSubmit={handleSubmit}>
            {/* Avatar */}
            <div className="flex flex-col items-center -mt-16 mb-4">
              <div className="rounded-full border-4 border-blue-400 shadow-lg p-1 bg-white">
                <Avatar className="w-28 h-28">
                  <AvatarImage src={formState.photo_url ? formState.photo_url.replace('uc?id=', 'uc?export=view&id=') : "/placeholder.svg"} />
                  <AvatarFallback className="text-3xl">{formState.name?.[0] || "DR"}</AvatarFallback>
                </Avatar>
                
              </div>
              {editMode && (
                <div className="w-full mt-2 flex flex-col gap-2">
                  <label htmlFor="photo-upload" className="flex items-center gap-2 cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg shadow transition-colors w-fit">
                    <Camera className="h-4 w-4" />
                    <span>Escolher foto</span>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Nome e Email */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-1">
                <User className="h-5 w-5 text-blue-500" />
                {editMode ? (
                  <Input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className="text-center"
                  />
                ) : (
                  <span className="text-xl font-bold text-gray-800">{formState.name}</span>
                )}
              </div>
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                {editMode ? (
                  <Input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    className="text-center"
                  />
                ) : (
                  <span className="text-gray-500">{formState.email}</span>
                )}
              </div>
            </div>

            {/* Dados Pessoais */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <IdCard className="h-4 w-4 text-blue-400" />
                <span className="font-semibold text-gray-700">Dados Pessoais</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-gray-400" />
                <span className="font-semibold">CPF:</span>
                {editMode ? (
                  <Input
                    type="text"
                    name="cpf"
                    value={formState.cpf}
                    onChange={handleChange}
                    className="w-full"
                  />
                ) : (
                  <span>{formState.cpf || "-"}</span>
                )}
              </div>
              <div className="mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="font-semibold">Telefone:</span>
                {editMode ? (
                  <Input
                    type="tel"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    className="w-full"
                  />
                ) : (
                  <span>{formState.phone || "-"}</span>
                )}
              </div>
            </div>

            {/* Dados do Veículo */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-4 w-4 text-blue-400" />
                <span className="font-semibold text-gray-700">Veículo</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                {formState.vehicle_type === "carro" ? (
                  <Car className="h-4 w-4 text-gray-400" />
                ) : formState.vehicle_type === "moto" ? (
                  <Bike className="h-4 w-4 text-gray-400 rotate-90" />
                ) : (
                  <Bike className="h-4 w-4 text-gray-400" />
                )}
                <span className="font-semibold">Tipo:</span>
                {editMode ? (
                  <select
                    name="vehicle_type"
                    value={formState.vehicle_type}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="">Selecione</option>
                    <option value="moto">Moto</option>
                    <option value="carro">Carro</option>
                    <option value="bicicleta">Bicicleta</option>
                  </select>
                ) : (
                  <span>{formState.vehicle_type || "-"}</span>
                )}
              </div>

              {/* Modelo apenas para moto e carro */}
              {editMode && formState.vehicle_type !== 'bicicleta' && (
                <div className="mb-2 flex items-center gap-2">
                  <Edit2 className="h-4 w-4 text-gray-400" />
                  <span className="font-semibold">Modelo:</span>
                  <Input
                    type="text"
                    name="vehicle_model"
                    value={formState.vehicle_model}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              )}

              {/* Placa apenas para moto e carro */}
              {editMode && formState.vehicle_type && formState.vehicle_type !== 'bicicleta' && (
                <div className="mb-2 flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-gray-400" />
                  <span className="font-semibold">Placa:</span>
                  <Input
                    type="text"
                    name="plate"
                    value={formState.plate}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="ABC1234"
                  />
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex flex-col gap-2 mt-6">
              {editMode ? (
                <>
                  <Button 
                    type="submit" 
                    className="w-full rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" /> Salvar
                  </Button>
                  <Button 
                    type="button"
                    className="w-full rounded-full" 
                    variant="outline" 
                    onClick={() => {
                      setEditMode(false);
                      setFormState({ // Restaura o estado original
                        name: deliveryPerson?.name || "",
                        email: deliveryPerson?.email || "",
                        cpf: deliveryPerson?.cpf || "",
                        phone: deliveryPerson?.phone || "",
                        vehicle_type: deliveryPerson?.vehicle_type || "",
                        vehicle_model: deliveryPerson?.vehicle_model || "",
                        has_plate: deliveryPerson?.has_plate || false,
                        plate: deliveryPerson?.plate || "",
                        photo_url: deliveryPerson?.photo_url || "",
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button 
                  type="button"
                  className="w-full rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2" 
                  onClick={() => setEditMode(true)}
                >
                  <Edit2 className="h-4 w-4" /> Editar Perfil
                </Button>
              )}
              <Button
                type="button"
                className="w-full rounded-full flex items-center justify-center gap-2"
                variant="destructive"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" /> Sair
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Rodapé fixo com informações
  const FooterBar = ({ notifications, faturamento, activeOrders }: { notifications: number, faturamento: number, activeOrders: number }) => {
    const navigate = useNavigate();
    
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    };

    return (
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg flex justify-around items-center py-2 z-40">
        <button onClick={() => navigate('/notifications')} className="flex flex-col items-center focus:outline-none">
          <span className="text-xs text-gray-500">Notificações</span>
          <span className="font-bold text-blue-600">{notifications}</span>
        </button>
        <button onClick={() => navigate('/faturamento')} className="flex flex-col items-center focus:outline-none">
          <span className="text-xs text-gray-500">Faturamento</span>
          <span className="font-bold text-green-600 text-xs">{formatCurrency(faturamento)}</span>
        </button>
        <button onClick={() => navigate('/active-orders')} className="flex flex-col items-center focus:outline-none">
          <span className="text-xs text-gray-500">Em Entrega</span>
          <span className="font-bold text-orange-500">{activeOrders}</span>
        </button>
      </footer>
    );
  };

  // Função para aceitar pedido
  const handleAcceptOrder = async (orderId: number) => {
    try {
      await api.post(`/orders/${orderId}/accept`);
      toast.success('Pedido aceito com sucesso!');
      // Busca os detalhes do pedido aceito para exibir na próxima tela
      const response = await api.get(`/orders/${orderId}`);
      setSelectedOrder(response.data);
      setCurrentScreen("orderDetails");
      // Atualiza a lista de pedidos disponíveis removendo o pedido aceito
      setPendingOrders(prev => prev.filter(order => order.pedido_id !== orderId));
    } catch (err: any) {
      if (err.response?.status === 400) {
        toast.error('Pedido não está mais disponível para entrega');
        // Remove o pedido da lista se não estiver mais disponível
        setPendingOrders(prev => prev.filter(order => order.pedido_id !== orderId));
      } else if (err.response?.status === 404) {
        toast.error('Pedido não encontrado');
      } else {
        toast.error(err.response?.data?.message || 'Erro ao aceitar pedido');
      }
    }
  };

  // Função para finalizar entrega
  const handleFinishOrder = async (orderId: number) => {
    try {
      // Verificar se o pedido está atribuído ao entregador logado
      const order = activeOrders.find((o: any) => o.id === orderId);
      if (!order) {
        toast.error('Pedido não encontrado');
        return;
      }
      if (Number(order.delivery_id) !== user?.id) {
        console.log(`Tentativa de finalizar pedido ${orderId}: delivery_id=${order.delivery_id}, user.id=${user?.id}`);
        toast.error('Você não tem permissão para finalizar este pedido');
        return;
      }

      await api.post(`/orders/${orderId}/finish`);
      toast.success('Entrega finalizada com sucesso!');
      // Atualiza a lista de pedidos em andamento
      const response = await api.get('/orders/active');
      const filteredOrders = response.data.filter((order: any) => 
        Number(order.delivery_id) === user?.id
      );
      setActiveOrders(filteredOrders);
    } catch (err: any) {
      if (err.response?.status === 403) {
        toast.error('Você não tem permissão para finalizar este pedido ou ele não está em entrega');
      } else if (err.response?.status === 404) {
        toast.error('Pedido não encontrado');
      } else {
        toast.error(err.response?.data?.message || 'Erro ao finalizar entrega');
      }
    }
  };

  // Renderização condicional das telas
  switch (currentScreen) {
    case "orderDetails":
      return <OrderDetails />;
    case "collected":
      return <CollectedScreen />;
    case "delivery":
      return <DeliveryScreen />;
    case "history":
      return <HistoryScreen />;
    case "profile":
      return <ProfileScreen />;
    default:
      return (
        <>
          <Dashboard />
          <OrderOfferModal
            offer={currentOffer}
            timeLeft={timeLeft}
            isVisible={isTimerActive}
            onAccept={acceptOffer}
            onReject={rejectOffer}
          />
        </>
      );
  }
};

export default Index;
