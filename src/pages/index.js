import Head from 'next/head';
import 'tailwindcss/tailwind.css';

// Folder Structure:
// /components
//   - AdminLogin.js
//   - AdminPanel.js
//   - ItemCard.js
// /pages
//   - index.js
//   - admin.js

const mockItems = [
  { id: 1, title: 'Conjunto de Talheres', price: 150, link: 'https://example.com/talheres' },
  { id: 2, title: 'Jogo de Toalhas', price: 200, link: 'https://example.com/toalhas' },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Chá de Casa Nova - Lucas Torres</title>
      </Head>
      <header className="bg-pink-500 p-4 text-center text-white font-bold text-xl">
        Lista de Presentes
      </header>
      <main className="p-4">
        <section className="mb-6 text-center">
          <h2 className='text-2xl'>
            Se você é meu amigo, me ajude a mobiliar essa casa. Obrigado.
          </h2>
          <p className="text-lg">
            O chá de casa nova acontecerá em <strong>10 de janeiro de 2025 às 18h</strong>.
          </p>
          <p className="text-lg">
            <strong>Endereço:</strong> Rua Hill de Moraes, 12, Apto. 908B, Fortaleza Sul Residencial, Fortaleza/CE
          </p>
          <a
            href="https://www.google.com/maps/place/Fortaleza+Sul+Residencial/@-3.7755385,-38.4785355,19z/data=!3m1!4b1!4m6!3m5!1s0x7c745fbb27700c5:0x3c70de2636b22852!8m2!3d-3.7755398!4d-38.4778918!16s%2Fg%2F11b808fvwk?entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
            Ver no Google Maps
          </a>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-4">Presentes Desejados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mockItems.map((item) => (
              <div
                key={item.id}
                className="border p-4 rounded bg-white shadow-sm hover:shadow-md">
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p>Preço: R${item.price}</p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline">
                  Comprar agora
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="bg-gray-200 text-center p-4 mt-8">
        Desenvolvido por Lucas Torres
      </footer>
    </div>
  );
};

export default Home;
