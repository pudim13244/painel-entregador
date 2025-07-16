import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();

  console.log('🔒 PrivateRoute - isAuthenticated:', isAuthenticated, 'loading:', loading);

  // Enquanto a autenticação inicial está carregando, mostra um loader
  if (loading) {
    console.log('⏳ PrivateRoute - Mostrando loader...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Se o usuário estiver autenticado, renderiza as rotas filhas
  if (isAuthenticated) {
    console.log('✅ PrivateRoute - Usuário autenticado, renderizando rotas');
    return <Outlet />;
  }

  // Se não estiver autenticado, redireciona para a página de login
  console.log('🚪 PrivateRoute - Usuário não autenticado, redirecionando para login');
  return <Navigate to="/login" replace />;
} 