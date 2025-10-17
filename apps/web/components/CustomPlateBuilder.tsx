'use client';

import { useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
}

interface MenuCategory {
  id: string;
  name: string;
  minSelect: number;
  maxSelect: number;
  items: MenuItem[];
}

interface CustomPlateBuilderProps {
  categories: MenuCategory[];
  onCalculate: (selectedIds: string[]) => void;
  totalPrice?: number;
}

export function CustomPlateBuilder({ categories, onCalculate, totalPrice }: CustomPlateBuilderProps) {
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const toggleItem = (categoryId: string, itemId: string, maxSelect: number) => {
    setSelected((prev) => {
      const current = prev[categoryId] || [];
      if (current.includes(itemId)) {
        return { ...prev, [categoryId]: current.filter((id) => id !== itemId) };
      } else if (current.length < maxSelect) {
        return { ...prev, [categoryId]: [...current, itemId] };
      }
      return prev;
    });
  };

  const handleCalculate = () => {
    const allIds = Object.values(selected).flat();
    onCalculate(allIds);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Monte seu Prato</h2>
      {categories.map((cat) => (
        <div key={cat.id} className="border p-4 rounded">
          <h3 className="font-semibold mb-2">
            {cat.name} (selecione {cat.minSelect}-{cat.maxSelect})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {cat.items.map((item) => {
              const isSelected = (selected[cat.id] || []).includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleItem(cat.id, item.id, cat.maxSelect)}
                  className={`p-2 border rounded ${isSelected ? 'bg-blue-600 text-white' : 'bg-white'}`}
                >
                  {item.name} - R$ {Number(item.price).toFixed(2)}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <button onClick={handleCalculate} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Calcular Preço
      </button>
      {totalPrice !== undefined && (
        <div className="text-xl font-bold text-center">Total: R$ {totalPrice.toFixed(2)}</div>
      )}
    </div>
  );
}
