import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ItemCard from '@/components/ItemCard';

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      const res = await fetch('/api/items/list');
      const data = await res.json();
      if (data && data.items) {
        // Ordenar: disponíveis (AVAILABLE) primeiro, depois PURCHASED
        const orderedItems = data.items.sort((a, b) => {
          if (a.status === 'AVAILABLE' && b.status === 'PURCHASED') return -1;
          if (a.status === 'PURCHASED' && b.status === 'AVAILABLE') return 1;
          return 0;
        });
        setItems(orderedItems);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function refreshItems() {
    fetchItems();
  }

  return (
    <Layout>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Convite</h2>
        <p>Chá de Casa Nova do <strong>Lucas Torres</strong></p>
        <p>Data: <strong>10 de Janeiro de 2025</strong> às 18h</p>
        <p>Endereço: Rua Exemplo, nº 123, Bairro Tal, Cidade XYZ</p>
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            window.open(
              'https://www.google.com/maps/search/?api=1&query=Rua+Exemplo+123+Bairro+Tal+Cidade+XYZ',
              '_blank'
            );
          }}
        >
          Ver no Google Maps
        </button>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Lista de Presentes</h2>
        {loading ? (
          <div className="flex justify-center items-center my-8">
            {/* Spinner com Tailwind */}
            <div className="w-12 h-12 border-4 border-blue-400 border-dashed rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <ItemCard 
                key={item.id} 
                item={item}
                onPurchaseComplete={refreshItems}
              />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
