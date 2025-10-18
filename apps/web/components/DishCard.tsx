'use client';

interface DishCardProps {
  name: string;
  description?: string;
  price: number | string;
  photoUrl?: string;
  prepMinutes?: number;
  ingredients?: string[];
  onAddToCart?: () => void;
}

export function DishCard({ name, description, price, photoUrl, prepMinutes, ingredients, onAddToCart }: DishCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
      {photoUrl && <img src={photoUrl} alt={name} className="w-full h-48 object-cover" />}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-lg">{name}</h3>
        {description && <p className="text-sm text-gray-600">{description}</p>}
        {ingredients && ingredients.length > 0 && (
          <p className="text-xs text-gray-500">Ingredientes: {ingredients.join(', ')}</p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold text-green-600">R$ {Number(price).toFixed(2)}</span>
          {prepMinutes && <span className="text-xs text-gray-500">{prepMinutes} min</span>}
        </div>
        {onAddToCart && (
          <button onClick={onAddToCart} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Adicionar ao Carrinho
          </button>
        )}
      </div>
    </div>
  );
}
