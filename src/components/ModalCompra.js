import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import { toast } from 'react-hot-toast';

export default function ModalCompra({ item, onClose, onPurchaseComplete }) {
  const [step, setStep] = useState(1);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');

  // Ao clicar em "Avançar", apenas vamos para o step 2 (exibe QRCode).
  // Mas primeiro validamos nome e telefone.
  const handleNext = () => {
    if (!nome.trim()) {
      toast.error("Por favor, preencha o nome.");
      return;
    }
    // Remove tudo que não for dígito
    const numericPhone = telefone.replace(/\D/g, '');
    // Exemplo: se for telefone brasileiro, com DDD + 9 dígitos = 11 digitos (ou 10, dependendo da região)
    if (numericPhone.length < 10 || numericPhone.length > 11) {
      toast.error("Telefone inválido. Formato esperado: (XX) XXXXX-XXXX");
      return;
    }
    setStep(2);
  };

  // Quando fecha, simula o "pagamento efetuado" e chama a API.
  async function handleClose() {
    // 1) Monta objeto com os dados
    const numericPhone = telefone.replace(/\D/g, ''); // só dígitos
    try {
      const res = await fetch('/api/purchases/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          buyerName: nome.trim(),
          buyerPhone: numericPhone,
          amount: item.price,
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
        // w-11/12 para mobile first, e sm:w-80 em telas maiores
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
                className="border w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Seu nome"
              />
            </label>
            <label className="block mb-4">
              Telefone:
              <InputMask
                mask="(99) 99999-9999"
                maskChar=""
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              >
                {(inputProps) => (
                  <input
                    {...inputProps}
                    className="border w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="(XX) XXXXX-XXXX"
                  />
                )}
              </InputMask>
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
              src="https://as1.ftcdn.net/v2/jpg/05/94/36/64/500_F_594366491_I3vaOX6ZasBJsZNfuNErXASCcpcsQ1Co.jpg"
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
