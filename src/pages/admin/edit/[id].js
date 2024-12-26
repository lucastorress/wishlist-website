import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

export default function EditItem() {
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('AVAILABLE'); // NOVO

  useEffect(() => {
    if (!id) return;
    fetchItemData();
  }, [id]);

  async function fetchItemData() {
    try {
      const res = await fetch('/api/items/list?id=' + id);
      const data = await res.json();
      if (data && data.items && data.items.length > 0) {
        const item = data.items[0];
        setTitle(item.title);
        setPrice(item.price);
        setLink(item.link);
        setImageUrl(item.imageUrl);
        setStatus(item.status); // Seta o status atual
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar dados do item.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/items/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: parseInt(id),
          title,
          price: parseFloat(price),
          link,
          imageUrl,
          status, // NOVO -> enviamos o status selecionado
        }),
      });
      if (res.ok) {
        toast.success("Item atualizado com sucesso!");
        router.push('/admin');
      } else {
        toast.error('Erro ao editar item.');
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao editar item.");
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Editar item (ID: {id})</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block mb-1">Título:</label>
          <input
            type="text"
            className="border w-full p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Preço:</label>
          <input
            type="number"
            step="0.01"
            className="border w-full p-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Link de pagamento:</label>
          <input
            type="text"
            className="border w-full p-2"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">URL da imagem:</label>
          <input
            type="text"
            className="border w-full p-2"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        {/* NOVO: seletor de status */}
        <div>
          <label className="block mb-1">Status:</label>
          <select
            className="border w-full p-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="PURCHASED">PURCHASED</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Salvar alterações
        </button>
      </form>
    </div>
  );
}
