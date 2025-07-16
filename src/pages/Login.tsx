import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  console.log('🔐 Login - isAuthenticated:', isAuthenticated, 'loading:', loading);

  // Se já estiver autenticado, redireciona para a página principal
  useEffect(() => {
    if (isAuthenticated && !loading) {
      console.log('✅ Login - Usuário já autenticado, redirecionando para /');
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Login - Tentando fazer login com:', email);
    
    if (!email.trim() || !password.trim()) {
      toast.error('Preencha e-mail e senha!');
      return;
    }
    
    setSubmitLoading(true);
    try {
      await login(email, password);
      toast.success('Login realizado com sucesso!');
      console.log('✅ Login - Login bem-sucedido, redirecionando para /');
      navigate('/'); // Redireciona para a tela principal do entregador
    } catch (err: any) {
      console.error('❌ Login - Erro no login:', err);
      toast.error(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-center">Login Entregador</h2>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="seu@email.com"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="Sua senha"
            className="mt-1"
          />
        </div>
        <Button type="submit" className="w-full" disabled={submitLoading}>
          {submitLoading ? 'Entrando...' : 'Entrar'}
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Cadastre-se aqui
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login; 