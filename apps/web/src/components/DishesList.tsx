import React from 'react';
import { useCart } from '../app/context/CartContext';
import Image from 'next/image';

export default function DishesList({ dishes }: { dishes: any[] }) {
  const { addItem } = useCart();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dishes.map(dish => (
        <div key={dish.id} className="border rounded-lg p-4 flex flex-col">
          {dish.imageUrl && (
            <Image src={dish.photoUrl} alt={dish.name} width={200} height={120} className="rounded mb-2" />
          )}
          <div className="font-bold text-lg mb-1">{dish.name}</div>
          <div className="text-gray-600 mb-2">R$ {dish.price.toFixed(2)}</div>
          <button
            className="bg-green-600 text-white py-2 rounded mt-auto"
            onClick={() => addItem({
              dishId: dish.id,
              name: dish.name,
              price: dish.price,
              imageUrl: dish.photoUrl,
              quantity: 1,
              chefId: dish.chefId,
            })}
          >
            Adicionar ao Carrinho
          </button>
        </div>
      ))}
    </div>
  );
}
