import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

interface OrderOffer {
  offer_id: number;
  order_id: number;
  status: string;
  created_at: string;
  pedido_id: number;
  order_status: string;
  order_created_at: string;
  cliente: string;
  telefone: string;
  endereco: string;
  estabelecimento: string;
}

let socket: Socket | null = null;

export const useOrderOffers = () => {
  const [currentOffer, setCurrentOffer] = useState<OrderOffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastOfferId, setLastOfferId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = JSON.parse(localStorage.getItem('user') || '{}');

  // Criar elemento de áudio para o som de alerta
  useEffect(() => {
    audioRef.current = new Audio('/sounds/notification.mp3');
    audioRef.current.volume = 0.5;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Função para tocar som de alerta
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.log('Erro ao tocar som:', err);
      });
    }
  };

  // Função para buscar ofertas
  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('/order-offers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const newOffers: OrderOffer[] = response.data;
      if (newOffers.length > 0) {
        const latestOffer = newOffers[0];
        if (!currentOffer || currentOffer.offer_id !== latestOffer.offer_id) {
          setCurrentOffer(latestOffer);
          playNotificationSound();
          setLastOfferId(latestOffer.offer_id);
        }
        // Se a oferta é a mesma, não faz nada!
      } else {
        if (currentOffer) {
          setCurrentOffer(null);
          setLastOfferId(null);
        }
      }
    } catch (err: any) {
      console.error('Erro ao buscar ofertas:', err);
      setError(err.response?.data?.message || 'Erro ao buscar ofertas');
      if (currentOffer) {
        setCurrentOffer(null);
        setLastOfferId(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Função para aceitar oferta
  const acceptOffer = async (offerId: number) => {
    try {
      setCurrentOffer(null); // Limpa imediatamente para parar o som
      setLastOfferId(null);
      await axios.post(`/order-offers/${offerId}/accept`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchOffers();
      return true;
    } catch (err: any) {
      setCurrentOffer(null);
      setLastOfferId(null);
      console.error('Erro ao aceitar oferta:', err);
      setError(err.response?.data?.message || 'Erro ao aceitar oferta');
      return false;
    }
  };

  // Função para rejeitar oferta
  const rejectOffer = async (offerId: number) => {
    try {
      setCurrentOffer(null); // Limpa imediatamente para parar o som
      setLastOfferId(null);
      await axios.post(`/order-offers/${offerId}/reject`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchOffers();
      return true;
    } catch (err: any) {
      setCurrentOffer(null);
      setLastOfferId(null);
      console.error('Erro ao rejeitar oferta:', err);
      setError(err.response?.data?.message || 'Erro ao rejeitar oferta');
      return false;
    }
  };

  // Buscar ofertas apenas uma vez ao montar o componente
  useEffect(() => {
    fetchOffers();
  }, []);

  // Polling contínuo para buscar ofertas e tocar som enquanto houver oferta
  useEffect(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
    // Se houver oferta pendente, faz polling mais frequente
    if (currentOffer) {
      pollingRef.current = setInterval(() => {
        fetchOffers();
        // Só toca o som se mudou a oferta (feito no fetchOffers)
      }, 2000); // a cada 2 segundos
    } else {
      // Se não há oferta, faz polling normal
      pollingRef.current = setInterval(() => {
        fetchOffers();
      }, 4000); // a cada 4 segundos
    }
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [currentOffer]);

  // Conectar ao WebSocket e registrar entregador
  useEffect(() => {
    if (!user?.id) return;
    if (!socket) {
      socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000');
      socket.on('connect', () => {
        socket?.emit('registrar_entregador', user.id);
      });
      socket.on('nova_oferta', (data) => {
        // Quando receber nova oferta, buscar ofertas do backend
        fetchOffers();
      });
    } else {
      socket.emit('registrar_entregador', user.id);
    }
    return () => {
      socket?.off('nova_oferta');
    };
  }, [user?.id]);

  // Timer visual baseado no created_at da oferta
  let timeLeft = 20;
  let isTimerActive = false;
  if (currentOffer) {
    const createdAt = new Date(currentOffer.created_at).getTime();
    const now = Date.now();
    timeLeft = Math.max(0, 20 - Math.floor((now - createdAt) / 1000));
    isTimerActive = timeLeft > 0;
  }

  return {
    currentOffer,
    timeLeft,
    isTimerActive,
    isLoading,
    error,
    acceptOffer,
    rejectOffer,
    fetchOffers
  };
}; 