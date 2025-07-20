import { useEffect, useState, useRef, useCallback, useMemo } from "react";
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
  RefreshCw,
  CreditCard,
  TrendingUp,
  Calendar,
  Zap
} from "lucide-react";
import api, { fetchDeliveryProfile, updateDeliveryProfile } from "@/services/api";
import { toast } from 'sonner';
import { useAuth } from "@/contexts/AuthContext";

import { useNotifications } from "@/hooks/useNotifications";

import { io } from "socket.io-client";
import notificationSound from "@/../public/sounds/notification.mp3";

// Funções auxiliares
function isThisWeek(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return date >= startOfWeek && date <= endOfWeek;
}

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
  const formRef = useRef({
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
  
  const [form, setForm] = useState(formRef.current);

  // Função para atualizar o form de forma otimizada
  const updateForm = useCallback((field: string, value: any) => {
    formRef.current = { ...formRef.current, [field]: value };
    setForm(formRef.current);
  }, []);

  const [todayFaturamento, setTodayFaturamento] = useState(0);
  const [weekFaturamento, setWeekFaturamento] = useState(0);
  const [offerStatus, setOfferStatus] = useState({ active_offers: 0, max_offers: 3, can_receive_more: true, remaining_slots: 3 });
  const { unreadCount: unreadNotifications, fetchUnreadCount } = useNotifications();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Buscar status das ofertas
  const fetchOfferStatus = useCallback(async () => {
    try {
      const response = await api.get('/order-offers/status');
      setOfferStatus(response.data);
    } catch (err) {
      // Erro silencioso
    }
  }, []);

  // Funções auxiliares otimizadas com useCallback
  const refreshOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/order-offers/active');
      const activeOffers = response.data.filter((offer: any) => !offer.expirada);
      setPendingOrders(activeOffers);
      await fetchOfferStatus();
    } catch (err) {
      setPendingOrders([]);
    } finally {
      setLoading(false);
    }
  }, [fetchOfferStatus]);

  const fetchActiveOrders = useCallback(async () => {
    try {
      const response = await api.get('/orders/active');
      setActiveOrders(response.data);
    } catch (err) {
      setActiveOrders([]);
    }
  }, []);

  const fetchTodayFaturamento = useCallback(async () => {
    try {
      const response = await api.get('/orders/history');
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = response.data.filter((order: any) => 
        order.finished_at && order.finished_at.startsWith(today)
      );
      const total = todayOrders.reduce((sum: number, order: any) => 
        sum + Number(order.delivery_fee || 3), 0
      );
      setTodayFaturamento(total);
    } catch (err) {
      setTodayFaturamento(0);
    }
  }, []);

  const fetchFaturamento = useCallback(async () => {
    try {
      const response = await api.get('/delivery-history');
      const weekOrders = response.data.filter((order: any) => 
        order.finished_at && isThisWeek(order.finished_at)
      );
      const total = weekOrders.reduce((sum: number, order: any) => 
        sum + Number(order.delivery_fee || 3), 0
      );
      setWeekFaturamento(total);
    } catch (err) {
      setWeekFaturamento(0);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await fetchDeliveryProfile();
      setDeliveryPerson(profile);
      
      // Só atualizar o form se não estiver em modo de edição
      if (!editMode) {
        const newForm = {
          name: profile?.name || "",
          email: profile?.email || "",
          cpf: profile?.cpf || "",
          phone: profile?.phone || "",
          vehicle_type: profile?.vehicle_type || "",
          vehicle_model: profile?.vehicle_model || "",
          has_plate: profile?.has_plate || false,
          plate: profile?.plate || "",
          photo_url: profile?.photo_url || "",
        };
        
        formRef.current = newForm;
        setForm(newForm);
      }
    } catch (err) {
      // Erro silencioso
    }
  }, [editMode]);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await api.get('/delivery-history');
      setHistory(response.data);
    } catch (err) {
      setHistory([]);
    }
  }, []);

  // Handlers
  const handleAcceptOffer = async (offerId: number) => {
    try {
      await api.post(`/order-offers/${offerId}/accept`);
      toast.success("Oferta aceita com sucesso!");
      refreshOrders();
      fetchActiveOrders();
    } catch (err) {
      toast.error("Erro ao aceitar oferta");
    }
  };

  const handleFinishOrder = async (orderId: number) => {
    try {
      await api.post(`/orders/${orderId}/finish`);
      toast.success("Entrega finalizada com sucesso!");
      fetchActiveOrders();
      fetchTodayFaturamento();
      fetchFaturamento();
      fetchHistory(); // Adicionar para atualizar o histórico
    } catch (err) {
      toast.error("Erro ao finalizar entrega");
    }
  };

  const handleAvailabilityChange = (checked: boolean) => {
    setIsAvailable(checked);
    if (checked && !isProfileComplete()) {
      setShowProfileAlert(true);
      setIsAvailable(false);
    }
  };

  function isProfileComplete(formData = form) {
    const requiredFields = ['name', 'email', 'phone', 'vehicle_type'];
    return requiredFields.every(field => formData[field] && formData[field].trim() !== '');
  }

  function getCamposFaltando(form: any) {
    const requiredFields = [
      { key: 'name', label: 'Nome' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Telefone' },
      { key: 'vehicle_type', label: 'Tipo de Veículo' }
    ];
    
    return requiredFields
      .filter(field => !form[field.key] || form[field.key].trim() === '')
      .map(field => field.label);
  }

  // Sempre que mudar, salva no localStorage
  useEffect(() => {
    localStorage.setItem('isAvailable', JSON.stringify(isAvailable));
  }, [isAvailable]);

  // Buscar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchActiveOrders(),
          fetchProfile(),
          fetchHistory(),
          fetchTodayFaturamento(),
          fetchFaturamento(),
          fetchUnreadCount()
        ]);
      } catch (err) {
        // Erro ao buscar dados iniciais:
      }
    };

    fetchData();
  }, []); // Removidas as dependências para executar apenas uma vez

  const FooterBar = ({ notifications, faturamento, activeOrders, currentScreen }: { notifications: number, faturamento: number, activeOrders: number, currentScreen: string }) => {
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
            className={`flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity ${
              currentScreen === "dashboard" ? "opacity-100" : "opacity-60"
            }`}
            onClick={() => setCurrentScreen("dashboard")}
          >
            <div className="relative">
              <Package className={`h-6 w-6 ${currentScreen === "dashboard" ? "text-blue-600" : "text-gray-600"}`} />
              {notifications > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {notifications}
                </Badge>
              )}
            </div>
            <span className={`text-xs mt-1 ${currentScreen === "dashboard" ? "text-blue-600 font-medium" : "text-gray-600"}`}>Dashboard</span>
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
            onClick={() => navigate('/entregas')}
          >
            <div className="relative">
              <Truck className="h-6 w-6 text-orange-600" />
              {activeOrders > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500">
                  {activeOrders}
                </Badge>
              )}
            </div>
            <span className="text-xs text-gray-600 mt-1">Entregas</span>
          </div>
          <div 
            className={`flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity ${
              currentScreen === "profile" ? "opacity-100" : "opacity-60"
            }`}
            onClick={() => setCurrentScreen("profile")}
          >
            <User className={`h-6 w-6 ${currentScreen === "profile" ? "text-blue-600" : "text-blue-600"}`} />
            <span className={`text-xs mt-1 ${currentScreen === "profile" ? "text-blue-600 font-medium" : "text-gray-600"}`}>Perfil</span>
          </div>
        </div>
      </div>
    );
  };





  // Buscar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchActiveOrders(),
          fetchProfile(),
          fetchHistory(),
          fetchTodayFaturamento(),
          fetchFaturamento(),
          fetchUnreadCount()
        ]);
      } catch (err) {
        // Erro ao buscar dados iniciais:
      }
    };

    fetchData();
  }, [fetchActiveOrders, fetchProfile, fetchHistory, fetchTodayFaturamento, fetchFaturamento, fetchUnreadCount]);

  // Inicializa o elemento de áudio
  useEffect(() => {
    audioRef.current = new window.Audio(notificationSound);
    audioRef.current.volume = 0.5;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Buscar ofertas do entregador (OTIMIZADO)
  useEffect(() => {
    const fetchOffers = async () => {
      if (!isAvailable) {
        setPendingOrders([]);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get('/order-offers/active');
        const activeOffers = response.data.filter((offer: any) => !offer.expirada);
        
        setPendingOrders(activeOffers);
        await fetchOfferStatus();
      } catch (err) {
        // Erro ao buscar ofertas:
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
    
    const interval = setInterval(fetchOffers, 10000);
    return () => clearInterval(interval);
  }, [isAvailable]); // Removida dependência de fetchOfferStatus



  // WebSocket otimizado
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (user?.id) {
      socket.emit('registrar_entregador', user.id);
      
      socket.on('nova_oferta', async (data) => {
        // Tocar som de notificação
        if (audioRef.current) {
          audioRef.current.play().catch(err => {
            // Erro ao tocar som
          });
        }
        
        // Mostrar toast
        toast.success(`Nova oferta disponível!`);
        
        // Atualizar ofertas apenas se necessário
        if (isAvailable) {
          try {
            const response = await api.get('/order-offers/active');
            const activeOffers = response.data.filter((offer: any) => !offer.expirada);
            setPendingOrders(activeOffers);
          } catch (err) {
            // Erro ao buscar ofertas via WebSocket:
          }
        }
      });
    }
    
    return () => {
      socket.disconnect();
    };
  }, []); // Removida dependência de isAvailable


  const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        await login(email, password);
        toast.success('Login realizado com sucesso!');
      } catch (error: any) {
        // Erro no login:
        toast.error(error.response?.data?.message || 'Erro ao fazer login');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Quick Entregadores</h1>
            <p className="text-gray-600">Faça login para começar a trabalhar</p>
          </div>
          
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3"
                  disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Dashboard Moderno
  const Dashboard = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Header Moderno */}
        <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <Avatar 
                onClick={() => setCurrentScreen("profile")}
                className="cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105 ring-2 ring-blue-100 hover:ring-blue-300"
                style={{ width: '60px', height: '60px' }}
              >
                <AvatarImage 
                  src={form.photo_url || deliveryPerson?.photo_url ? (form.photo_url || deliveryPerson.photo_url).replace('uc?id=', 'uc?export=view&id=') : "/placeholder.svg"} 
                />
                <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {deliveryPerson?.name?.[0] || "DR"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{deliveryPerson?.name || "Entregador"}</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{deliveryPerson?.rating !== undefined ? deliveryPerson.rating : "0"}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="font-medium">{deliveryPerson?.totalDeliveries !== undefined ? `${deliveryPerson.totalDeliveries} entregas` : "0 entregas"}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                  {isAvailable ? "Disponível" : "Indisponível"}
                </span>
                <div className="text-xs text-gray-400">
                  {isAvailable ? "Recebendo pedidos" : "Modo offline"}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={isAvailable} 
                  onCheckedChange={handleAvailabilityChange}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
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

        {/* Seção de Ganhos Moderna */}
        {isAvailable ? (
          <>
            <div className="mb-6 pt-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-orange-600" />
                    Pedidos Disponíveis
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={refreshOrders}
                    disabled={loading}
                    className="hover:bg-orange-50 hover:border-orange-200 transition-colors"
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Atualizando...' : 'Atualizar'}
                  </Button>
                </div>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Carregando pedidos...</span>
                  </div>
                </div>
              ) : pendingOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-600 mb-2">
                    {!offerStatus.can_receive_more ? 'Limite de ofertas atingido' : 'Nenhum pedido disponível'}
                  </h4>
                  <p className="text-gray-500">
                    {!offerStatus.can_receive_more 
                      ? 'Você já tem 3 ofertas ativas. Aguarde elas expirarem ou serem aceitas.'
                      : 'Aguarde novos pedidos chegarem...'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingOrders.map((offer) => {
                    return (
                      <Card 
                        key={offer.offer_id} 
                        className="border-2 border-orange-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-orange-50 to-yellow-50"
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <span className="font-bold text-xl text-orange-800">#{offer.pedido_id}</span>
                              <Badge className="ml-2 bg-orange-100 text-orange-800 border-orange-200">
                                Disponível
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-600">Cliente</div>
                              <div className="font-semibold text-gray-800">{offer.cliente}</div>
                            </div>
                          </div>
                          
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{offer.telefone}</span>
                            </div>
                            <div className="flex items-start space-x-2">
                              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                              <span className="text-sm text-gray-600">{offer.endereco}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{offer.estabelecimento}</span>
                            </div>
                          </div>
                          
                          <Button
                            size="lg"
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold transition-all duration-300 hover:scale-105"
                            onClick={() => handleAcceptOffer(offer.offer_id)}
                          >
                            Aceitar Entrega
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
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
                          <Badge className="bg-blue-100 text-blue-800 font-semibold text-base shadow">
                            {order.payment_method === 'CASH' ? 'Dinheiro' : order.payment_method === 'CREDIT' ? 'Cartão de Crédito' : order.payment_method === 'DEBIT' ? 'Cartão de Débito' : order.payment_method === 'PIX' ? 'PIX' : order.payment_method}
                          </Badge>
                          {order.change_amount !== undefined && order.change_amount !== null && Number(order.change_amount) > 0 && (
                            <Badge className="bg-green-100 text-green-800 font-semibold text-base shadow">
                              Troco: R$ {Number(order.change_amount).toFixed(2).replace('.', ',')}
                            </Badge>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Telefone: {order.customer_phone}</span>
                          <Button 
                            size="sm"
                            className="ml-4"
                            onClick={e => {
                              e.stopPropagation();
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

            {/* Botões de Navegação Modernos */}
            <div className="mt-8 space-y-4 pb-24">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="w-full h-16 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300 hover:shadow-lg transition-all duration-300"
                  onClick={() => navigate('/faturamento')}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <DollarSign className="h-6 w-6 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Faturamento</span>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-16 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                  onClick={() => navigate('/recebimentos')}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Recebimentos</span>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-16 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300"
                  onClick={() => setCurrentScreen("history")}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <History className="h-6 w-6 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">Histórico</span>
                  </div>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Você está indisponível</h3>
            <p className="text-gray-500 mb-6 max-w-md">
              Ative sua disponibilidade para começar a receber pedidos e ganhar dinheiro
            </p>
            <Button 
              onClick={() => handleAvailabilityChange(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Ficar Disponível
            </Button>
          </div>
        )}

        {/* Rodapé fixo */}
        <FooterBar notifications={unreadNotifications} faturamento={todayFaturamento} activeOrders={activeOrders?.length || 0} currentScreen={currentScreen} />
      </div>
    );
  };

  // Tela de Perfil
  const ProfileScreen = () => {
    const handleSave = async () => {
      try {
        await updateDeliveryProfile(formRef.current);
        toast.success('Perfil atualizado com sucesso!');
        setEditMode(false);
      } catch (err) {
        toast.error('Erro ao atualizar perfil');
      }
    };

    const handlePhotoUpload = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            const formData = new FormData();
            formData.append('photo', file);
            
            const response = await api.post('/delivery-person/upload-photo', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Atualizar o formulário com a nova URL
            updateForm('photo_url', response.data.url);
            
            toast.success('Foto atualizada com sucesso!');
          } catch (err) {
            toast.error('Erro ao fazer upload da foto');
          }
        }
      };
      input.click();
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentScreen("dashboard")}
                className="p-2"
              >
                <Navigation className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-800">Meu Perfil</h1>
            </div>
            <div className="flex items-center space-x-2">
              {editMode ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditMode(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleSave}
                  >
                    Salvar
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditMode(true)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Conteúdo do Perfil */}
        <div className="p-6 space-y-6 pb-24">
          {/* Foto do Perfil */}
          <div className="flex justify-center">
            <div className="relative">
              <Avatar 
                className="w-24 h-24 ring-4 ring-white shadow-lg"
              >
                <AvatarImage 
                  src={form.photo_url || deliveryPerson?.photo_url ? (form.photo_url || deliveryPerson.photo_url).replace('uc?id=', 'uc?export=view&id=') : "/placeholder.svg"} 
                />
                <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {deliveryPerson?.name?.[0] || "DR"}
                </AvatarFallback>
              </Avatar>
              {editMode && (
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  onClick={handlePhotoUpload}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Informações do Perfil */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  disabled={!editMode}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  disabled={!editMode}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  disabled={!editMode}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={form.cpf}
                  onChange={(e) => updateForm('cpf', e.target.value)}
                  disabled={!editMode}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Informações do Veículo */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Informações do Veículo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicle_type">Tipo de Veículo</Label>
                  <select
                    id="vehicle_type"
                    value={form.vehicle_type}
                    onChange={(e) => updateForm('vehicle_type', e.target.value)}
                    disabled={!editMode}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 px-3 py-2"
                  >
                    <option value="">Selecione...</option>
                    <option value="MOTO">Moto</option>
                    <option value="CARRO">Carro</option>
                    <option value="BICICLETA">Bicicleta</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="vehicle_model">Modelo</Label>
                  <Input
                    id="vehicle_model"
                    value={form.vehicle_model}
                    onChange={(e) => updateForm('vehicle_model', e.target.value)}
                    disabled={!editMode}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_plate"
                    checked={form.has_plate}
                    onCheckedChange={(checked) => updateForm('has_plate', checked)}
                    disabled={!editMode}
                  />
                  <Label htmlFor="has_plate">Possui Placa</Label>
                </div>
                {form.has_plate && (
                  <div>
                    <Label htmlFor="plate">Placa</Label>
                    <Input
                      id="plate"
                      value={form.plate}
                      onChange={(e) => updateForm('plate', e.target.value)}
                      disabled={!editMode}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Estatísticas */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Estatísticas
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{deliveryPerson?.totalDeliveries || 0}</div>
                    <div className="text-sm text-gray-600">Entregas Realizadas</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{deliveryPerson?.rating || 0}</div>
                    <div className="text-sm text-gray-600">Avaliação</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{activeOrders?.length || 0}</div>
                    <div className="text-sm text-gray-600">Em Andamento</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{todayFaturamento.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Hoje (R$)</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé fixo */}
        <FooterBar notifications={unreadNotifications} faturamento={todayFaturamento} activeOrders={activeOrders?.length || 0} currentScreen={currentScreen} />
      </div>
    );
  };

  // Tela de Histórico
  const HistoryScreen = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentScreen("dashboard")}
                className="p-2"
              >
                <Navigation className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-800">Histórico de Entregas</h1>
            </div>
          </div>
        </div>

        {/* Conteúdo do Histórico */}
        <div className="p-6 pb-24">
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-600 mb-2">Nenhuma entrega encontrada</h4>
                <p className="text-gray-500">Seu histórico de entregas aparecerá aqui</p>
              </div>
            ) : (
              history.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
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
                      <span>{order.finished_at ? new Date(order.finished_at).toLocaleString() : '-'}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge className="bg-blue-100 text-blue-800 font-semibold text-base shadow">
                        {order.payment_method === 'CASH' ? 'Dinheiro' : order.payment_method === 'CREDIT' ? 'Cartão de Crédito' : order.payment_method === 'DEBIT' ? 'Cartão de Débito' : order.payment_method === 'PIX' ? 'PIX' : order.payment_method}
                      </Badge>
                      {order.change_amount !== undefined && order.change_amount !== null && Number(order.change_amount) > 0 && (
                        <Badge className="bg-green-100 text-green-800 font-semibold text-base shadow">
                          Troco: R$ {Number(order.change_amount).toFixed(2).replace('.', ',')}
                        </Badge>
                      )}
                      <Badge className="bg-green-100 text-green-800 font-semibold text-base shadow">
                        R$ {Number(order.delivery_fee || 3).toFixed(2).replace('.', ',')}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Telefone: {order.customer_phone}</span>
                      <Badge className="bg-green-500 text-white">Finalizada</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Rodapé fixo */}
        <FooterBar notifications={unreadNotifications} faturamento={todayFaturamento} activeOrders={activeOrders?.length || 0} currentScreen={currentScreen} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {currentScreen === "login" ? <LoginScreen /> : 
       currentScreen === "dashboard" ? <Dashboard /> : 
       currentScreen === "profile" ? <ProfileScreen /> : 
       currentScreen === "history" ? <HistoryScreen /> : null}
    </div>
  );
};

export default Index;
