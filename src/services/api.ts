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
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ [API] Token adicionado para:', config.url);
  } else {
    console.log('❌ [API] Token não encontrado para:', config.url);
  }
  
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  response => {
    console.log('✅ [API] Resposta bem-sucedida:', response.status, response.config.url);
    return response;
  },
  error => {
    console.log('❌ [API] Erro na requisição:', error.response?.status, error.config?.url);
    
    if (error.response && error.response.status === 401) {
      console.log('🚪 [API] Erro 401 detectado');
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