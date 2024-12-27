import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import ItemCard from '@/components/ItemCard';
import { PrismaClient } from '@prisma/client';

export async function getServerSideProps() {
  const prisma = new PrismaClient();

  // Busca todos os itens, com category e purchases ativas
  const allItems = await prisma.item.findMany({
    include: {
      category: true,
      purchases: {
        where: { active: true }, // só conta compras ativas
      },
    },
  });

  // Calcula cotas vendidas e remainingInstallments
  const itemsWithCalc = allItems.map((item) => {
    const totalCotasVendidas = item.purchases.reduce(
      (acc, p) => acc + p.quantity,
      0
    );
    const remainingInstallments = item.installments - totalCotasVendidas;

    return {
      ...item,
      totalCotasVendidas,
      remainingInstallments: remainingInstallments < 0 ? 0 : remainingInstallments,
    };
  });

  // Agrupar por categoria
  const byCategory = {};
  itemsWithCalc.forEach((item) => {
    const catName = item.category?.name || 'Sem categoria';
    if (!byCategory[catName]) {
      byCategory[catName] = [];
    }
    byCategory[catName].push(item);
  });

  const totalItems = itemsWithCalc.length;

  // Serializar para evitar erro com Date
  const safeByCategory = JSON.parse(JSON.stringify(byCategory));

  return {
    props: {
      byCategory: safeByCategory,
      totalItems,
    },
  };
}

export default function Home({ byCategory, totalItems }) {
  return (
    <>
      <Head>
          <title>Lista de presentes</title>
          <meta name="description" content="Lista de presentes do chá de casa nova do Lucas Torres" />
      </Head>
      <Layout>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Convite</h2>
          <p>Chá de Casa Nova do <strong>Lucas Torres</strong></p>
          <p>Data: <strong>12 de Janeiro de 2025 às 18h</strong></p>
          <p>Endereço: Rua Hill de Moraes, 12, Apto. 908B</p>
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => {
              window.open(
                'https://www.google.com/maps/place/Fortaleza+Sul+Residencial/@-3.7755385,-38.4785355,19z/data=!3m1!4b1!4m6!3m5!1s0x7c745fbb27700c5:0x3c70de2636b22852!8m2!3d-3.7755398!4d-38.4778918!16s%2Fg%2F11b808fvwk?entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D',
                '_blank'
              );
            }}
          >
            Ver no Google Maps
          </button>
        </section>

        {totalItems === 0 ? (
          <p className="text-center text-gray-600">
            Ainda não foram cadastrados itens na lista de presentes.
          </p>
        ) : (
          Object.keys(byCategory).map((catName) => (
            <div key={catName} className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{catName}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {byCategory[catName].map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    // Se quiser, pode recarregar a página após comprar
                    onPurchaseComplete={() => window.location.reload()}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </Layout>
    </>
  );
}
