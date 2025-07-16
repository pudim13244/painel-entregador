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
    console.log('🔍 Verificando autenticação...');
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('Token no localStorage:', token ? 'Presente' : 'Ausente');
    console.log('User no localStorage:', userData ? 'Presente' : 'Ausente');
    
    if (!token || !userData) {
      console.log('❌ Token ou user não encontrados no localStorage');
      setUser(null);
      setLoading(false);
      return false;
    }

    try {
      console.log('📡 Fazendo requisição para /profile...');
      // Verificar se o token é válido fazendo uma requisição para o perfil
      const response = await api.get('/profile');
      console.log('✅ Resposta do /profile:', response.data);
      
      // Atualizar o usuário com os dados mais recentes
      const updatedUser = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: 'DELIVERY'
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setLoading(false);
      return true;
    } catch (error) {
      console.error('❌ Token inválido ou expirado:', error);
      console.error('❌ Detalhes do erro:', error.response?.data);
      console.error('❌ Status do erro:', error.response?.status);
      
      // NÃO limpar o localStorage automaticamente - deixar o usuário tentar fazer login novamente
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
      
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    console.log('🔐 Fazendo login...');
    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;
      
      console.log('✅ Login bem-sucedido, salvando token...');
      console.log('Token recebido:', token ? 'Presente' : 'Ausente');
      console.log('User recebido:', user);
      
      // Salvar token e usuário no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Atualizar estado
      setUser(user);
      
      console.log('✅ Token e user salvos no localStorage');
      console.log('Token salvo:', localStorage.getItem('token') ? 'Sim' : 'Não');
      console.log('User salvo:', localStorage.getItem('user') ? 'Sim' : 'Não');
      
    } catch (error) {
      console.error('❌ Erro no login:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Fazendo logout...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
    };

    initAuth();
  }, []);

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