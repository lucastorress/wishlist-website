import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { toast } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch('/api/items/list');
      if (res.status === 401) {
        Router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (data && Array.isArray(data.items)) {
        setItems(data.items);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar itens.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(itemId) {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      try {
        const res = await fetch('/api/items/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: itemId }),
        });
        if (res.ok) {
          toast.success("Item excluído com sucesso!");
          setItems(items.filter(i => i.id !== itemId));
        } else {
          toast.error("Não foi possível excluir o item.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao excluir item.");
      }
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>
      <button
        onClick={() => Router.push('/admin/new')}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
      >
        Cadastrar novo item
      </button>

      {loading ? (
        <div className="flex justify-center items-center">
          <ClipLoader color="#36d7b7" size={50} /> 
          {/* Ajuste cor e tamanho do spinner como preferir */}
        </div>
      ) : (
        <>
          {(!items || items.length === 0) ? (
            <p>Nenhum item cadastrado ainda.</p>
          ) : (
            <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Título</th>
                  <th className="px-4 py-2">Preço</th>
                  <th className="px-4 py-2">Link</th>
                  <th className="px-4 py-2">Imagem</th>
                  <th className="px-4 py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td className="border px-4 py-2">{item.id}</td>
                    <td className="border px-4 py-2">{item.title}</td>
                    <td className="border px-4 py-2">{item.price}</td>
                    <td className="border px-4 py-2">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline break-all"
                      >
                        Ver link
                      </a>
                    </td>
                    <td className="border px-4 py-2">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-16 object-cover"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => Router.push(`/admin/edit/${item.id}`)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
