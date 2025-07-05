import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();

  // Enquanto a autenticação inicial está carregando, mostra um loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Se o usuário estiver autenticado, renderiza as rotas filhas
  if (isAuthenticated) {
    return <Outlet />;
  }

  // Se não estiver autenticado, redireciona para a página de login
  return <Navigate to="/login" replace />;
} 