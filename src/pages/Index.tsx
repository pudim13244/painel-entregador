
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  AlertCircle
} from "lucide-react";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("dashboard");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Dados mockados
  const deliveryPerson = {
    name: "João Silva",
    rating: 4.8,
    totalDeliveries: 1247,
    todayEarnings: 125.50,
    weekEarnings: 567.30
  };

  const pendingOrders = [
    {
      id: "001",
      restaurant: "Burger King",
      restaurantAddress: "Rua das Flores, 123",
      customerName: "Maria Santos",
      customerAddress: "Av. Paulista, 456 - Apt 102",
      value: 45.90,
      distance: "2.3 km",
      estimatedTime: "25 min",
      items: ["2x Whopper", "1x Batata Grande", "2x Coca-Cola"]
    },
    {
      id: "002",
      restaurant: "Pizza Hut",
      restaurantAddress: "Rua do Comércio, 789",
      customerName: "Pedro Costa",
      customerAddress: "Rua da Paz, 321",
      value: 78.50,
      distance: "1.8 km",
      estimatedTime: "20 min",
      items: ["1x Pizza Margherita G", "1x Refrigerante 2L"]
    }
  ];

  const deliveryHistory = [
    {
      id: "H001",
      date: "2024-06-08",
      restaurant: "McDonald's",
      customer: "Ana Silva",
      value: 32.80,
      earning: 8.20,
      rating: 5
    },
    {
      id: "H002",
      date: "2024-06-08",
      restaurant: "Subway",
      customer: "Carlos Lima",
      value: 25.90,
      earning: 6.50,
      rating: 4
    }
  ];

  // Tela de Login
  const LoginScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">
            Rush Route Driver
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
            onClick={() => setIsLoggedIn(true)}
          >
            Entrar
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Dashboard Principal
  const Dashboard = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{deliveryPerson.name}</h2>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{deliveryPerson.rating}</span>
                <span>•</span>
                <span>{deliveryPerson.totalDeliveries} entregas</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm">
              {isAvailable ? "Disponível" : "Indisponível"}
            </span>
            <Switch 
              checked={isAvailable} 
              onCheckedChange={setIsAvailable}
            />
          </div>
        </div>
      </div>

      {/* Ganhos */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Hoje</p>
                  <p className="text-xl font-semibold">R$ {deliveryPerson.todayEarnings.toFixed(2)}</p>
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
                  <p className="text-xl font-semibold">R$ {deliveryPerson.weekEarnings.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pedidos Pendentes */}
        {isAvailable && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Pedidos Disponíveis
            </h3>
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{order.restaurant}</h4>
                        <p className="text-sm text-muted-foreground">{order.restaurantAddress}</p>
                      </div>
                      <Badge variant="secondary">R$ {order.value.toFixed(2)}</Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{order.distance}</span>
                      <Clock className="h-4 w-4 ml-3 mr-1" />
                      <span>{order.estimatedTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Para: {order.customerName}</span>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setCurrentScreen("orderDetails");
                        }}
                      >
                        Aceitar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!isAvailable && (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Você está indisponível</h3>
              <p className="text-muted-foreground mb-4">
                Ative sua disponibilidade para receber pedidos
              </p>
            </CardContent>
          </Card>
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
    </div>
  );

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
                <span>R$ {selectedOrder?.value.toFixed(2)}</span>
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
              onClick={() => {
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
            {deliveryHistory.map((delivery) => (
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
                        +R$ {delivery.earning.toFixed(2)}
                      </p>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm">{delivery.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Valor: R$ {delivery.value.toFixed(2)}</span>
                    <span>{delivery.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="week">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Histórico da semana</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="month">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Histórico do mês</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  // Renderização condicional das telas
  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  switch (currentScreen) {
    case "orderDetails":
      return <OrderDetails />;
    case "collected":
      return <CollectedScreen />;
    case "delivery":
      return <DeliveryScreen />;
    case "history":
      return <HistoryScreen />;
    default:
      return <Dashboard />;
  }
};

export default Index;
