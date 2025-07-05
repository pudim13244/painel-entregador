import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async (): Promise<boolean> => {
    const token = localStorage.getItem('delivery_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return false;
    }

    try {
      // Verificar se o token é válido fazendo uma requisição para o perfil
      const response = await api.get('/profile');
      setUser(response.data);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Token inválido ou expirado:', error);
      localStorage.removeItem('delivery_token');
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('delivery_token', token);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('delivery_token');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const initAuth = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        navigate('/login');
      }
    };

    initAuth();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
      checkAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 