import React from 'react';
import { useCart } from '../app/context/CartContext';
import Image from 'next/image';

export default function CartSidebar() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) return null;

  return (
    <aside className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Carrinho</h2>
      <ul className="flex-1 overflow-y-auto">
        {items.map(item => (
          <li key={item.dishId} className="flex items-center mb-3">
            {item.imageUrl && (
              <Image src={item.imageUrl} alt={item.name} width={48} height={48} className="rounded" />
            )}
            <div className="ml-2 flex-1">
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-gray-500">R$ {item.price.toFixed(2)}</div>
              <div className="flex items-center mt-1">
                <button onClick={() => updateQuantity(item.dishId, item.quantity - 1)} disabled={item.quantity <= 1} className="px-2">-</button>
                <span className="mx-2">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.dishId, item.quantity + 1)} className="px-2">+</button>
              </div>
            </div>
            <button onClick={() => removeItem(item.dishId)} className="ml-2 text-red-500">Remover</button>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <div className="font-bold text-lg">Total: R$ {total.toFixed(2)}</div>
        <button className="w-full bg-green-600 text-white py-2 rounded mt-2">Finalizar Pedido</button>
        <button onClick={clearCart} className="w-full text-gray-500 py-2 mt-1">Limpar Carrinho</button>
      </div>
    </aside>
  );
}
