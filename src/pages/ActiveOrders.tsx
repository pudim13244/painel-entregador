import React from 'react';

const ActiveOrders = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-8">
      <h1 className="text-2xl font-bold mb-4">Pedidos em Entrega</h1>
      <div className="bg-white rounded-lg shadow p-4 w-full max-w-md">
        <p className="text-gray-500 text-center">Nenhum pedido em entrega no momento.</p>
      </div>
    </div>
  );
};

export default ActiveOrders; 