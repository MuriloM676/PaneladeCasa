'use client';

import { useEffect, useState } from 'react';
import { DishCard } from '../../../components/DishCard';
import { CustomPlateBuilder } from '../../../components/CustomPlateBuilder';

interface Chef {
  kitchenName: string;
  bio?: string;
}

interface Dish {
  id: string;
  name: string;
  description?: string;
  price: number;
  photoUrl?: string;
  prepMinutes?: number;
  ingredients?: string[];
}

interface MenuCategory {
  id: string;
  name: string;
  minSelect: number;
  maxSelect: number;
  items: Array<{ id: string; name: string; price: number }>;
}

export default function ChefPage({ params }: { params: { id: string } }) {
  const [chef, setChef] = useState<Chef | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [plateTotal, setPlateTotal] = useState<number | undefined>();

  useEffect(() => {
    // Busca dados reais via API (proxy via Next.js rewrites)
    fetch(`/api/chefs/${params.id}`)
      .then((r) => r.json())
      .then((data) => setChef(data))
      .catch(() => {});

  fetch(`/api/dishes?chefId=${params.id}`)
      .then((r) => r.json())
      .then((data) => setDishes(data))
      .catch(() => {});

  fetch(`/api/menu/categories/${params.id}`)
      .then((r) => r.json())
      .then((data) => setCategories(data))
      .catch(() => {});
  }, [params.id]);

  const handleCalculate = async (itemIds: string[]) => {
    const res = await fetch('/api/orders/calculate-plate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menuItemIds: itemIds }),
    });
    const data = await res.json();
    setPlateTotal(data.total);
  };

  return (
    <div className="space-y-6">
      {chef && (
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold">{chef.kitchenName}</h1>
          {chef.bio && <p className="text-gray-600 mt-2">{chef.bio}</p>}
        </div>
      )}
      {dishes.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Pratos Prontos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dishes.map((dish) => (
              <DishCard key={dish.id} {...dish} onAddToCart={() => alert('Adicionar ao carrinho (mock)')} />
            ))}
          </div>
        </div>
      )}
      {categories.length > 0 && (
        <div>
          <CustomPlateBuilder categories={categories} onCalculate={handleCalculate} totalPrice={plateTotal} />
        </div>
      )}
    </div>
  );
}
