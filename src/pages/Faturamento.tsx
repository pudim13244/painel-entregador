import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, DollarSign, Package, TrendingUp, Filter, Building2, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: number;
  created_at: string;
  restaurant: string;
  customer: string;
  value: number;
  earning: number; // taxa de entrega
  establishment_id: number;
}

interface EstablishmentFaturamento {
  id: number;
  name: string;
  total_orders: number;
  total_delivery_fees: number;
  total_value: number;
  orders: Order[];
}

const Faturamento = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [establishments, setEstablishments] = useState<EstablishmentFaturamento[]>([]);
  const [totalFaturamento, setTotalFaturamento] = useState(0);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchTodayOrders();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      applyDateFilter();
    } else {
      setFilteredOrders(orders);
    }
  }, [selectedDate, orders]);

  const fetchTodayOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/history');
      const allOrders = response.data;

      // Filtrar apenas pedidos de hoje por padrão
      const today = new Date();
      const todayOrders = allOrders.filter((order: Order) => {
        const orderDate = new Date(order.created_at);
        return (
          orderDate.getDate() === today.getDate() &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        );
      });

      setOrders(allOrders); // Guardar todos os pedidos
      setFilteredOrders(todayOrders); // Mostrar apenas hoje inicialmente
      calculateFaturamento(todayOrders);

    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      toast.error('Erro ao carregar dados de faturamento');
    } finally {
      setLoading(false);
    }
  };

  const applyDateFilter = () => {
    if (!selectedDate) {
      setFilteredOrders(orders);
      calculateFaturamento(orders);
      return;
    }

    const selectedDateObj = new Date(selectedDate);
    const filtered = orders.filter((order: Order) => {
      const orderDate = new Date(order.created_at);
      return (
        orderDate.getDate() === selectedDateObj.getDate() &&
        orderDate.getMonth() === selectedDateObj.getMonth() &&
        orderDate.getFullYear() === selectedDateObj.getFullYear()
      );
    });

    setFilteredOrders(filtered);
    calculateFaturamento(filtered);
  };

  const calculateFaturamento = (ordersToCalculate: Order[]) => {
    // Calcular faturamento por estabelecimento
    const establishmentMap = new Map<number, EstablishmentFaturamento>();

    ordersToCalculate.forEach((order: Order) => {
      const existing = establishmentMap.get(order.establishment_id);
      
      if (existing) {
        existing.total_orders += 1;
        existing.total_delivery_fees += order.earning;
        existing.total_value += order.value;
        existing.orders.push(order);
      } else {
        establishmentMap.set(order.establishment_id, {
          id: order.establishment_id,
          name: order.restaurant,
          total_orders: 1,
          total_delivery_fees: order.earning,
          total_value: order.value,
          orders: [order]
        });
      }
    });

    const establishmentsArray = Array.from(establishmentMap.values());
    setEstablishments(establishmentsArray);

    // Calcular totais
    const totalFees = ordersToCalculate.reduce((sum: number, order: Order) => sum + order.earning, 0);
    setTotalFaturamento(totalFees);
    setTotalPedidos(ordersToCalculate.length);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const resetToToday = () => {
    setSelectedDate('');
    const today = new Date();
    const todayOrders = orders.filter((order: Order) => {
      const orderDate = new Date(order.created_at);
      return (
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      );
    });
    setFilteredOrders(todayOrders);
    calculateFaturamento(todayOrders);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDisplayDate = () => {
    if (selectedDate) {
      return formatDate(selectedDate);
    }
    return formatDate(new Date().toISOString());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8">
        <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Carregando faturamento...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header com Total do Dia */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Faturamento por Estabelecimento</h1>
          
          {/* Card do Total do Dia */}
          <Card className="mb-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Total do Dia</h2>
                  <p className="text-green-100 text-lg">
                    {selectedDate ? `Faturamento de ${getDisplayDate()}` : 'Faturamento de hoje'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold">{formatCurrency(totalFaturamento)}</p>
                  <p className="text-green-100">
                    {totalPedidos} {totalPedidos === 1 ? 'pedido' : 'pedidos'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Filtro de Data */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtro por Data
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetToToday}
                  className="text-xs"
                >
                  Hoje
                </Button>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Selecione uma data:
                  </label>
                  <Input
                    id="date-filter"
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="w-full"
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={applyDateFilter}
                    disabled={!selectedDate}
                    className="h-10"
                  >
                    Filtrar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cards dos Estabelecimentos */}
        {establishments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {selectedDate ? 'Nenhuma entrega nesta data' : 'Nenhuma entrega hoje'}
              </h3>
              <p className="text-gray-500">
                {selectedDate 
                  ? 'Não foram encontradas entregas para a data selecionada.'
                  : 'Você ainda não realizou nenhuma entrega hoje.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {establishments.map((establishment) => (
              <Card key={establishment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <span className="text-lg font-semibold text-gray-900">{establishment.name}</span>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {establishment.total_orders} {establishment.total_orders === 1 ? 'pedido' : 'pedidos'}
                    </Badge>
                  </CardTitle>
                  
                  {/* Resumo do Estabelecimento */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Taxas de Entrega</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(establishment.total_delivery_fees)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Valor Total</p>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(establishment.total_value)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  {/* Lista de Pedidos */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Package className="h-4 w-4 mr-2" />
                      Pedidos Realizados
                    </h4>
                    
                    {establishment.orders.map((order) => (
                      <div key={order.id} className="bg-gray-50 rounded-lg p-3 border-l-4 border-green-500">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">#{order.id}</span>
                            <Badge variant="outline" className="text-xs">
                              {formatTime(order.created_at)}
                            </Badge>
                          </div>
                          <span className="text-green-600 font-bold">
                            {formatCurrency(order.earning)}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <span>Cliente: {order.customer}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Valor do pedido: {formatCurrency(order.value)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Média por Pedido */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Média por Pedido</p>
                      <p className="text-lg font-bold text-purple-600">
                        {formatCurrency(establishment.total_delivery_fees / establishment.total_orders)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Faturamento; 