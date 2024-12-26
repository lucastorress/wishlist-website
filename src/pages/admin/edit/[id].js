import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function EditItem() {
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (!id) return;
    // Busca dados do item
    fetch('/api/items/list?id=' + id)
      .then(res => res.json())
      .then(data => {
        const item = data.items[0];
        setTitle(item.title);
        setPrice(item.price);
        setLink(item.link);
        setImageUrl(item.imageUrl);
      })
      .catch(err => console.error(err));
  }, [id]);

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
        }),
      });
      if (res.ok) {
        router.push('/admin');
      } else {
        alert('Erro ao editar item.');
      }
    } catch (err) {
      console.error(err);
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
