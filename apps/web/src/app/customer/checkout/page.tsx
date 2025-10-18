import React, { useMemo, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const total = useMemo(() => items.reduce((sum: number, item: { price: number; quantity: number }) => sum + Number(item.price) * item.quantity, 0), [items]);
  const chefId = useMemo(() => (items.length ? items[0].chefId : ''), [items]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      // Use proxy rewrite of Next.js
      const res = await fetch('/api/orders/quick-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((i: { dishId: string; quantity: number }) => ({ dishId: i.dishId, quantity: i.quantity })),
          chefId,
          deliveryAddress: 'Endereço de teste',
          deliveryFee: 0,
          paymentMethod: 'MOCK',
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Erro ao criar pedido');
      }
      setSuccess(true);
      clearCart();
      setTimeout(() => router.push('/customer/dashboard'), 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar pedido');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'CUSTOMER') {
    return <div className="p-8 text-center">Apenas clientes podem finalizar pedidos.</div>;
  }

  if (items.length === 0) {
    return <div className="p-8 text-center">Seu carrinho está vazio.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-6">Finalizar Pedido</h1>
      <ul className="mb-6">
        {items.map((item: { dishId: string; name: string; price: number; quantity: number }) => (
          <li key={item.dishId} className="flex justify-between items-center py-2 border-b">
            <span>{item.quantity}x {item.name}</span>
            <span>R$ {Number(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
  <div className="font-bold text-lg mb-4">Total: R$ {Number(total).toFixed(2)}</div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success ? (
        <div className="text-green-600 font-bold mb-4">Pedido realizado com sucesso! Redirecionando...</div>
      ) : (
        <button
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Finalizar Pedido'}
        </button>
      )}
    </div>
  );
}
