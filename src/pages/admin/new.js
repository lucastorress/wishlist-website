import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import { toast } from 'react-hot-toast';

export default function NewItem() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [installments, setInstallments] = useState(1);
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Buscar categorias
    fetch('/api/categories/list')
      .then(r => r.json())
      .then(data => setCategories(data.categories || []))
      .catch(err => console.error(err));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/items/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          price: parseFloat(price),
          installments: parseInt(installments),
          link,
          imageUrl,
          categoryId: categoryId ? parseInt(categoryId) : null,
        }),
      });
      if (!res.ok) {
        toast.error("Erro ao cadastrar item.");
      } else {
        toast.success("Item cadastrado com sucesso!");
        Router.push('/admin');
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar item.");
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
          <label className="block mb-1">Preço (valor total):</label>
          <input
            type="number"
            step="0.01"
            className="border w-full p-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* Seletor de 1 a 12 parcelas */}
        <div>
          <label className="block mb-1">Parcelas (1 a 12):</label>
          <select
            className="border w-full p-2"
            value={installments}
            onChange={(e) => setInstallments(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
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

        {/* Select de categoria (opcional) */}
        <div>
          <label className="block mb-1">Categoria (opcional):</label>
          <select
            className="border w-full p-2"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Sem categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
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
