import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ModalCompra({ item, onClose, onPurchaseComplete }) {
  const [step, setStep] = useState(1);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleNext = () => {
    if (!nome.trim()) {
      toast.error("Por favor, preencha o nome.");
      return;
    }
    const numericPhone = telefone.replace(/\D/g, '');
    if (numericPhone.length < 10 || numericPhone.length > 11) {
      toast.error("Telefone inválido. Formato esperado: (XX) XXXXX-XXXX");
      return;
    }
    // Valida quantity
    const qtd = parseInt(quantity);
    if (qtd < 1 || qtd > item.remainingInstallments) {
      toast.error(`Você só pode comprar entre 1 e ${item.remainingInstallments} cotas.`);
      return;
    }
    setStep(2);
  };

  async function handleClose() {
    try {
      const numericPhone = telefone.replace(/\D/g, '');
      const res = await fetch('/api/purchases/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          buyerName: nome.trim(),
          buyerPhone: numericPhone,
          quantity: parseInt(quantity), // quantas cotas
        }),
      });
      if (!res.ok) {
        throw new Error('Erro ao criar a compra');
      }
      toast.success("Compra registrada com sucesso!");
      onPurchaseComplete && onPurchaseComplete();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível concluir a compra.");
    }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target.className.includes('bg-black bg-opacity-50')) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white p-4 rounded shadow w-11/12 sm:w-80"
        onClick={(e) => e.stopPropagation()}
      >
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-2">
              Dados para compra de {item.title}
            </h2>
            <label className="block mb-2">
              Nome:
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="border w-full p-2 mt-1"
                placeholder="Seu nome"
              />
            </label>
            <label className="block mb-2">
              Telefone:
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="border w-full p-2 mt-1"
                placeholder="(XX) XXXXX-XXXX"
              />
            </label>

            <label className="block mb-4">
              Quantas cotas deseja comprar? (1 - {item.remainingInstallments})
              <select
                className="border w-full p-2 mt-1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              >
                {Array.from({ length: item.remainingInstallments }, (_, i) => i + 1).map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex justify-end">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleNext}
              >
                Avançar
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-2">Pagamento por PIX</h2>
            <p className="mb-4">Use o QRCode abaixo para pagamento:</p>
            <img
              src="/qrcode-placeholder.png"
              alt="QRCode Mock"
              className="w-48 h-48 mx-auto"
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={handleClose}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
