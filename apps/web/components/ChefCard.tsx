'use client';

interface Chef {
  id: string;
  kitchenName: string;
  bio?: string;
  cuisineTypes: string[];
  location?: string;
}

interface ChefCardProps {
  chef: Chef;
  onViewMenu: (id: string) => void;
}

export function ChefCard({ chef, onViewMenu }: ChefCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold mb-2">{chef.kitchenName}</h3>
      {chef.bio && <p className="text-sm text-gray-600 mb-2">{chef.bio}</p>}
      {chef.cuisineTypes.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {chef.cuisineTypes.map((ct) => (
            <span key={ct} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {ct}
            </span>
          ))}
        </div>
      )}
      {chef.location && <p className="text-xs text-gray-500 mb-3">📍 {chef.location}</p>}
      <button
        onClick={() => onViewMenu(chef.id)}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Ver Cardápio
      </button>
    </div>
  );
}
