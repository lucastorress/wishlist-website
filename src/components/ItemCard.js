import React, { useState } from 'react';
import ModalCompra from './ModalCompra';

export default function ItemCard({ item, onPurchaseComplete }) {
  const [showModal, setShowModal] = useState(false);

  const isPurchased = item.status === 'PURCHASED';
  const pricePerInstallment = (item.price / item.installments).toFixed(2);

  return (
    <div className="border rounded shadow p-4 flex flex-col justify-between">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-32 object-cover mb-2"
      />
      <h3 className="font-bold text-lg">{item.title}</h3>

      <p className="text-gray-700">
        Preço total: R$ {item.price.toFixed(2)}
      </p>
      <p className="text-gray-700">
        Parcelas: {item.installments}x
      </p>
      <p className="text-gray-700">
        Valor de cada cota: R$ {pricePerInstallment}
      </p>

      {isPurchased ? (
        <p className="mt-2 text-red-600 font-semibold">Já adquirido</p>
      ) : (
        <p className="mt-2 text-green-600 font-semibold">
          Faltam {item.remainingInstallments} cotas
        </p>
      )}

      {!isPurchased && (
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
          onPurchaseComplete={onPurchaseComplete}
        />
      )}
    </div>
  );
}
