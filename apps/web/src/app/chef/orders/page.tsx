'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Order {
  id: string;
  status: string;
  createdAt: string;
  customer: { user: { email: string } };
  items: Array<{ dish: { name: string; photoUrl?: string }; quantity: number }>;
}

const statusOptions = [
  'NEW',
  'PREPARING',
  'READY',
  'DELIVERING',
  'COMPLETED',
  'CANCELLED',
];

const statusLabels: Record<string, string> = {
  NEW: 'Novo',
  PREPARING: 'Preparando',
  READY: 'Pronto',
  DELIVERING: 'Em entrega',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

export default function ChefOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'CHEF') fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/chefs/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erro ao buscar pedidos');
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/chefs/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Erro ao atualizar status');
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar status');
    }
  };

  if (!user || user.role !== 'CHEF') {
    return <div className="p-8 text-center">Apenas chefs podem acessar esta página.</div>;
  }

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-6">Pedidos Recebidos</h1>
      {orders.length === 0 ? (
        <div className="text-center text-gray-600">Nenhum pedido recebido ainda.</div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-bold">Pedido #{order.id.slice(0,8)}</span>
                  <span className="ml-4 text-gray-600">{new Date(order.createdAt).toLocaleString('pt-BR')}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>{statusLabels[order.status] || order.status}</span>
              </div>
              <div className="mb-2 text-sm text-gray-700">Cliente: {order.customer.user.email}</div>
              <div className="mb-2">
                <span className="font-bold">Itens:</span>
                <ul className="ml-2">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.quantity}x {item.dish.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2 mt-2">
                {statusOptions.map(opt => (
                  <button
                    key={opt}
                    disabled={order.status === opt}
                    onClick={() => handleStatusChange(order.id, opt)}
                    className={`px-3 py-1 rounded ${order.status === opt ? 'bg-gray-300 text-gray-500' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
                  >
                    {statusLabels[opt]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
