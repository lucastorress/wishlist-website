export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <header className="bg-blue-500 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">Chá de Casa Nova - Lucas Torres</h1>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center p-4 text-sm">
        <p>Feito com Next.js & TailwindCSS</p>
      </footer>
    </div>
  );
}
