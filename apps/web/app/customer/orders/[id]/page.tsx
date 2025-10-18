'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderStatus {
  id: string;
  status: string;
  createdAt: string;
  total: number;
  chef: {
    kitchenName: string;
  };
  customer: {
    user: {
      email: string;
    };
  };
  items?: Array<{
    quantity: number;
    dish: {
      name: string;
      photoUrl?: string;
    };
  }>;
}

type OrderStatusType = 'NEW' | 'PREPARING' | 'READY' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';

const statusSteps: { key: OrderStatusType; label: string; icon: string; description: string }[] = [
  { key: 'NEW', label: 'Novo Pedido', icon: '📋', description: 'Pedido recebido' },
  { key: 'PREPARING', label: 'Preparando', icon: '👨‍🍳', description: 'Chef está preparando' },
  { key: 'READY', label: 'Pronto', icon: '✅', description: 'Pedido pronto para entrega' },
  { key: 'DELIVERING', label: 'Em Entrega', icon: '🚚', description: 'A caminho' },
  { key: 'COMPLETED', label: 'Entregue', icon: '🎉', description: 'Pedido concluído' },
];

const statusColors: Record<OrderStatusType, string> = {
  NEW: 'bg-blue-500',
  PREPARING: 'bg-orange-500',
  READY: 'bg-yellow-500',
  DELIVERING: 'bg-purple-500',
  COMPLETED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
};

export default function CustomerOrderTrackingPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    if (user?.role === 'CUSTOMER') {
      fetchOrderStatus();
      // Atualizar a cada 10 segundos
      const interval = setInterval(fetchOrderStatus, 10000);
      return () => clearInterval(interval);
    }
  }, [user, params.id]);

  const fetchOrderStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${params.id}/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar status do pedido');
      }

      const data = await response.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingRating(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: params.id,
          stars: rating,
          comment: comment,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar avaliação');
      }

      alert('Avaliação enviada com sucesso! Obrigado pelo feedback.');
      setShowRatingForm(false);
      setComment('');
      setRating(5);
    } catch (err: any) {
      alert(err.message || 'Erro ao enviar avaliação');
    } finally {
      setSubmittingRating(false);
    }
  };

  const getCurrentStepIndex = (status: string): number => {
    if (status === 'CANCELLED') return -1;
    const index = statusSteps.findIndex((step) => step.key === status);
    return index >= 0 ? index : 0;
  };

  if (!user || user.role !== 'CUSTOMER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-4">Apenas clientes podem acessar o rastreamento de pedidos.</p>
          <Link href="/login" className="text-orange-600 hover:text-orange-700 font-medium">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro</h1>
          <p className="text-gray-600 mb-4">{error || 'Pedido não encontrado'}</p>
          <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium">
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex(order.status);
  const isCancelled = order.status === 'CANCELLED';
  const isCompleted = order.status === 'COMPLETED';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Rastreamento do Pedido</h1>
                <p className="text-orange-100">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-orange-100 mb-1">Total</p>
                <p className="text-3xl font-bold">R$ {Number(order.total).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Chef</p>
                <p className="font-semibold text-gray-900">{order.chef.kitchenName}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Data do Pedido</p>
                <p className="font-semibold text-gray-900">
                  {new Date(order.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        {!isCancelled ? (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Status do Pedido</h2>
            
            {/* Timeline Desktop */}
            <div className="hidden md:block">
              <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200"></div>
                {/* Progress Bar Fill */}
                <div
                  className={`absolute top-12 left-0 h-1 ${statusColors[order.status as OrderStatusType]} transition-all duration-500`}
                  style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                ></div>

                <div className="relative flex justify-between">
                  {statusSteps.map((step, index) => {
                    const isActive = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                      <div key={step.key} className="flex flex-col items-center" style={{ width: '20%' }}>
                        {/* Icon Circle */}
                        <div
                          className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-4 transition-all duration-300 ${
                            isActive
                              ? `${statusColors[order.status as OrderStatusType]} text-white shadow-lg transform scale-110`
                              : 'bg-gray-200 text-gray-400'
                          } ${isCurrent ? 'animate-pulse' : ''}`}
                        >
                          {step.icon}
                        </div>
                        {/* Label */}
                        <div className="text-center">
                          <p
                            className={`font-semibold mb-1 ${
                              isActive ? 'text-gray-900' : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className={`text-xs ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Timeline Mobile */}
            <div className="md:hidden space-y-4">
              {statusSteps.map((step, index) => {
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step.key} className="flex items-center">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mr-4 flex-shrink-0 ${
                        isActive
                          ? `${statusColors[order.status as OrderStatusType]} text-white shadow-lg`
                          : 'bg-gray-200 text-gray-400'
                      } ${isCurrent ? 'animate-pulse' : ''}`}
                    >
                      {step.icon}
                    </div>
                    {/* Info */}
                    <div className="flex-1">
                      <p className={`font-semibold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      <p className={`text-sm ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                        {step.description}
                      </p>
                    </div>
                    {/* Check */}
                    {isActive && !isCurrent && (
                      <div className="ml-4">
                        <svg
                          className="w-6 h-6 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Current Status Message */}
            <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-center text-gray-700">
                <span className="font-semibold">Status atual:</span>{' '}
                {statusSteps[currentStepIndex]?.description || 'Processando'}
              </p>
            </div>
          </div>
        ) : (
          // Cancelled State
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
                ❌
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">Pedido Cancelado</h2>
              <p className="text-gray-600">Este pedido foi cancelado.</p>
            </div>
          </div>
        )}

        {/* Order Items */}
        {order.items && order.items.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Itens do Pedido</h2>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  {item.dish.photoUrl && (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                      <img
                        src={item.dish.photoUrl}
                        alt={item.dish.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.dish.name}</p>
                    <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rating Section */}
        {isCompleted && !showRatingForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Pedido Entregue!</h2>
              <p className="text-gray-600 mb-4">Como foi sua experiência?</p>
              <button
                onClick={() => setShowRatingForm(true)}
                className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
              >
                ⭐ Avaliar Chef
              </button>
            </div>
          </div>
        )}

        {/* Rating Form */}
        {isCompleted && showRatingForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Avaliar {order.chef.kitchenName}</h2>
            <form onSubmit={handleSubmitRating} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nota (1 a 5 estrelas)
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-4xl transition-colors ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-lg font-semibold text-gray-700">{rating}/5</span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentário (opcional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Conte-nos sobre sua experiência..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={submittingRating}
                  className="flex-1 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition-colors"
                >
                  {submittingRating ? 'Enviando...' : 'Enviar Avaliação'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRatingForm(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}
