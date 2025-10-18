'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface OrderStatus {
  id: string;
  status: string;
  createdAt: string;
  total: number | string;
  chef: { kitchenName: string };
  customer: { user: { email: string } };
}

export default function OrderTrackingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!params.id) return;
    fetchOrderStatus();
    // Optionally, poll for status updates
    // const interval = setInterval(fetchOrderStatus, 10000);
    // return () => clearInterval(interval);
  }, [params.id]);

  const fetchOrderStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${params.id}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Pedido não encontrado');
      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar pedido');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="p-8 text-center">Faça login para rastrear seu pedido.</div>;
  }

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (!order) {
    return <div className="p-8 text-center">Pedido não encontrado.</div>;
  }

  const statusMap: Record<string, string> = {
    NEW: 'Novo',
    PREPARING: 'Preparando',
    READY: 'Pronto para entrega',
    DELIVERING: 'Em entrega',
    COMPLETED: 'Concluído',
    CANCELLED: 'Cancelado',
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Rastreio do Pedido</h1>
      <div className="mb-4">
        <div className="text-gray-700">Pedido #{order.id.slice(0, 8)}</div>
        <div className="text-gray-700">Chef: {order.chef.kitchenName}</div>
        <div className="text-gray-700">Cliente: {order.customer.user.email}</div>
        <div className="text-gray-700">Total: R$ {Number(order.total).toFixed(2)}</div>
        <div className="text-gray-700">Criado em: {new Date(order.createdAt).toLocaleString('pt-BR')}</div>
      </div>
      <div className="mb-6">
        <span className="inline-block px-4 py-2 rounded bg-orange-100 text-orange-800 font-bold">
          Status: {statusMap[order.status] || order.status}
        </span>
      </div>
      {/* Avaliação após COMPLETED */}
      {order.status === 'COMPLETED' && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-2">Avalie o Chef</h2>
          <OrderRatingForm chefId={order.chef.kitchenName} orderId={order.id} />
        </div>
      )}
    </div>
  );
}

function OrderRatingForm({ chefId, orderId }: { chefId: string; orderId: string }) {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chefId, orderId, stars, comment }),
      });
      if (!res.ok) throw new Error('Erro ao enviar avaliação');
      setSuccess('Avaliação enviada com sucesso!');
      setComment('');
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar avaliação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nota</label>
        <select value={stars} onChange={e => setStars(Number(e.target.value))} className="px-2 py-1 rounded border">
          {[5,4,3,2,1].map(n => (
            <option key={n} value={n}>{n} estrelas</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Comentário</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} className="w-full border rounded px-2 py-1" />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <button type="submit" disabled={loading} className="bg-orange-600 text-white px-4 py-2 rounded">
        {loading ? 'Enviando...' : 'Enviar Avaliação'}
      </button>
    </form>
  );
}
