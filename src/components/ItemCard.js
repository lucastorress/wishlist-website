import React, { useState } from 'react';
import ModalCompra from './ModalCompra';

export default function ItemCard({ item }) {
  const [showModal, setShowModal] = useState(false);

  const isPurchased = item.status === 'PURCHASED';

  return (
    <div className="border rounded shadow p-4 flex flex-col justify-between">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-32 object-cover mb-2"
      />
      <h3 className="font-bold text-lg">{item.title}</h3>
      <p className="text-gray-700">Preço: R$ {item.price.toFixed(2)}</p>

      {isPurchased ? (
        <p className="mt-2 text-red-600 font-semibold">Já adquirido</p>
      ) : (
        <button
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => setShowModal(true)}
        >
          Comprar
        </button>
      )}

      {showModal && !isPurchased && (
        <ModalCompra
          item={item}
          onClose={() => setShowModal(false)}
          onPurchaseComplete={() => {
            // Se quiser alterar algo no front end após a compra
            // Por ex.: recarregar a página ou remover o botão
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
