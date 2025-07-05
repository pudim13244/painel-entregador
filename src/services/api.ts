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
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('delivery_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Apenas redireciona para login se for erro 401 (não autenticado)
      localStorage.removeItem('delivery_token');
      window.location.href = '/login';
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