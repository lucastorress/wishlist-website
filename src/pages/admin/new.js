import React, { useState } from 'react';
import Router from 'next/router';

export default function NewItem() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch('/api/items/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, price: parseFloat(price), link, imageUrl }),
      });
      if (res.ok) {
        Router.push('/admin');
      } else {
        alert("Erro ao cadastrar item.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar item.");
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Cadastrar novo item</h1>
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
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Salvar
        </button>
      </form>
    </div>
  );
}
