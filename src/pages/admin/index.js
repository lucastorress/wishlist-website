import React, { useEffect, useState } from 'react';
import Router from 'next/router';

export default function AdminDashboard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Verifica se está logado
    // Se não estiver (cookie ausente), redireciona para /admin/login
    fetch('/api/items/list')
      .then(res => {
        if (res.status === 401) {
          Router.push('/admin/login');
        }
        return res.json();
      })
      .then(data => setItems(data.items))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>
      <button
        onClick={() => Router.push('/admin/new')}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
      >
        Cadastrar novo item
      </button>
      
      {items?.length === 0 ? (
        <p>Nenhum item cadastrado ainda.</p>
      ) : (
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
                  <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                    Ver link
                  </a>
                </td>
                <td className="border px-4 py-2">
                  <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover" />
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => Router.push(`/admin/edit/${item.id}`)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm('Tem certeza que deseja excluir?')) {
                        await fetch('/api/items/delete', {
                          method: 'DELETE',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id: item.id }),
                        });
                        // Recarrega a lista
                        setItems(items.filter(i => i.id !== item.id));
                      }
                    }}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
