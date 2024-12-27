// src/pages/admin/categories/index.js
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Router from 'next/router';

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories/list');
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar categorias.");
    }
  }

  async function handleCreateCategory(e) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Digite o nome da categoria.");
      return;
    }
    try {
      const res = await fetch('/api/categories/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        toast.error("Erro ao criar categoria.");
        return;
      }
      toast.success("Categoria criada com sucesso!");
      setName('');
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar categoria.");
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Categorias</h1>

      {/* Form para criar nova categoria */}
      <form onSubmit={handleCreateCategory} className="mb-4 flex gap-2">
        <input
          type="text"
          className="border p-2"
          placeholder="Nova categoria"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Criar
        </button>
      </form>

      <hr className="mb-4" />

      {/* Listagem de categorias */}
      {categories.length === 0 ? (
        <p>Nenhuma categoria cadastrada.</p>
      ) : (
        <ul className="list-disc pl-5">
          {categories.map((cat) => (
            <li key={cat.id} className="mb-1">
              {cat.name}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => Router.push('/admin')}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Voltar para Admin
      </button>
    </div>
  );
}
