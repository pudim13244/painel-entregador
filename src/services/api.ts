import axios from 'axios';

interface DeliveryProfile {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  vehicle_type: string;
  vehicle_model: string;
  has_plate: boolean;
  plate?: string;
  photo_url?: string;
  rating?: number;
  totalDeliveries?: number;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('🌐 Requisição para:', config.url);
  console.log('Token presente:', token ? 'Sim' : 'Não');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Token adicionado ao header Authorization');
    console.log('Header Authorization:', config.headers.Authorization);
  } else {
    console.log('❌ Token não encontrado no localStorage');
  }
  
  console.log('Headers finais:', config.headers);
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  response => {
    console.log('✅ Resposta bem-sucedida:', response.status, response.config.url);
    return response;
  },
  error => {
    console.log('❌ Erro na requisição:', error.response?.status, error.config?.url);
    console.log('Erro completo:', error);
    
    if (error.response && error.response.status === 401) {
      console.log('🚪 Erro 401 detectado, mas não redirecionando automaticamente');
      // Removido o redirecionamento automático para permitir login manual
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const fetchDeliveryProfile = async (): Promise<DeliveryProfile> => {
  const response = await api.get('/profile');
  return response.data;
};

export const updateDeliveryProfile = async (data: DeliveryProfile): Promise<DeliveryProfile> => {
  const response = await api.put('/profile', data);
  return response.data;
}; 