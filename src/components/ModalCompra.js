import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import QRCode from 'qrcode';

export default function ModalCompra({ item, onClose, onPurchaseComplete }) {
  const [step, setStep] = useState(1);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Estado para armazenar o base64 do QRCode
  const [qrDataURL, setQrDataURL] = useState('');

  // Exemplo de código Pix. Ajuste conforme sua lógica de geração.
  const pixCopiaCola = '00020126650014br.gov.bcb.pix0121lucast0rr3s@gmail.com0218Lista de presentes5204000053039865802BR5925Lucas Pereira Torres De A6009Sao Paulo62290525REC676E0AEAE6ACB2957867666304D7BB';

  // Avança para step 2 (gerar QRCode)
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
    const qtd = parseInt(quantity);
    if (qtd < 1 || qtd > item.remainingInstallments) {
      toast.error(`Você só pode comprar entre 1 e ${item.remainingInstallments} cotas.`);
      return;
    }
    setStep(2);
  };

  // Quando step=2, gera o QRCode
  useEffect(() => {
    if (step === 2) {
      QRCode.toDataURL(pixCopiaCola, { width: 300 })
        .then((url) => {
          setQrDataURL(url);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Erro ao gerar QRCode Pix.");
        });
    }
     
  }, [step]);

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
          quantity: parseInt(quantity),
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

  // Função para copiar o código Pix
  const handleCopyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCopiaCola);
      toast.success("Código Pix copiado!");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível copiar o código Pix.");
    }
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

            {/* Exibe o QRCode ou um loading */}
            {qrDataURL ? (
              <img
                src={qrDataURL}
                alt="QRCode Pix"
                className="w-48 h-48 mx-auto mb-4"
              />
            ) : (
              <p className="text-center">Gerando QRCode...</p>
            )}

            {/* Código Pix “copia e cola” + botão de cópia */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Código Pix (copia e cola):
              </label>
              <div className="flex items-center gap-2">
                <textarea
                  readOnly
                  className="border w-full p-2 text-sm resize-none"
                  rows={3}
                  value={pixCopiaCola}
                />
                <button
                  type="button"
                  onClick={handleCopyPixCode}
                  className="bg-gray-200 p-2 rounded hover:bg-gray-300"
                  title="Copiar código Pix"
                >
                  {/* Ícone "copy" simples do HeroIcons */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16h8M8 12h8m-6 8h6a2 2 0 002-2V7a2 
                      2 0 00-2-2h-6m-4 4H5a2 2 0 00-2 2v10a2 
                      2 0 002 2h9a2 2 0 002-2v-1"
                    />
                  </svg>
                </button>
              </div>
            </div>

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
