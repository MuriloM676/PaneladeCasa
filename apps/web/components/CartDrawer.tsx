'use client';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartDrawerProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export function CartDrawer({ items, onRemove, onCheckout }: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Carrinho</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Carrinho vazio</p>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.quantity}x R$ {item.price.toFixed(2)}
                  </p>
                </div>
                <button onClick={() => onRemove(item.id)} className="text-red-600 hover:text-red-800">
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 mb-4">
            <p className="text-xl font-bold">Total: R$ {total.toFixed(2)}</p>
          </div>
          <button onClick={onCheckout} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Finalizar Pedido
          </button>
        </>
      )}
    </div>
  );
}
