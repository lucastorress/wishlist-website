import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ItemCard from '@/components/ItemCard';
import { PrismaClient } from '@prisma/client';

export async function getServerSideProps() {
  const prisma = new PrismaClient();
  const items = await prisma.item.findMany();
  return {
    props: {
      items: JSON.parse(JSON.stringify(items)),
    },
  };
}

export default function Home({ items }) {
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
            // Abre Google Maps numa nova aba
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </Layout>
  );
}
