'use client';

interface OrderTrackerProps {
  status: 'NEW' | 'PREPARING' | 'READY' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';
}

const statusLabels: Record<string, string> = {
  NEW: 'Novo',
  PREPARING: 'Em Preparo',
  READY: 'Pronto',
  DELIVERING: 'Saiu para Entrega',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

export function OrderTracker({ status }: OrderTrackerProps) {
  const steps = ['NEW', 'PREPARING', 'READY', 'DELIVERING', 'COMPLETED'];
  const currentIndex = steps.indexOf(status);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Status do Pedido</h2>
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => (
          <div key={step} className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                idx <= currentIndex ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              {idx + 1}
            </div>
            <p className="text-xs mt-1 text-center">{statusLabels[step]}</p>
          </div>
        ))}
      </div>
      {status === 'CANCELLED' && (
        <div className="bg-red-100 text-red-700 p-4 rounded">Pedido cancelado</div>
      )}
    </div>
  );
}
