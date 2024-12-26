import React, { useState } from 'react';

export default function ModalCompra({ item, onClose, onPurchaseComplete }) {
  const [step, setStep] = useState(1);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para criar a compra no backend
  async function createPurchase() {
    setLoading(true);
    try {
      const res = await fetch('/api/purchases/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          buyerName: nome,
          buyerPhone: telefone,
          amount: item.price, // ou outro valor
        }),
      });

      if (!res.ok) {
        throw new Error('Erro ao criar a compra');
      }

      // Se deu tudo certo, passamos para a próxima etapa
      setStep(2);
      // Notifica a pagina principal que houve uma compra, se desejar
      onPurchaseComplete && onPurchaseComplete(item.id);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleNext = () => {
    if (!nome || !telefone) {
      alert("Por favor, preencha nome e telefone.");
      return;
    }
    // Criar a compra no back-end antes de exibir QRCode
    createPurchase();
  };

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
        className="bg-white p-4 rounded shadow w-80"
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
                className="border w-full p-1 mt-1"
              />
            </label>
            <label className="block mb-2">
              Telefone:
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="border w-full p-1 mt-1"
              />
            </label>
            <div className="flex justify-end">
              <button
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleNext}
              >
                {loading ? 'Processando...' : 'Avançar'}
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
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                onClick={() => setStep(1)} // Se quiser voltar
              >
                Voltar
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={onClose}
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
