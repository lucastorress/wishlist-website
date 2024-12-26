export default function AdminLogin() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <form className="p-4 bg-white shadow-md rounded">
          <h2 className="text-lg font-semibold mb-4">Login Administrativo</h2>
          <input
            type="text"
            placeholder="Usuário"
            className="border mb-2 p-2 w-full"
          />
          <input
            type="password"
            placeholder="Senha"
            className="border mb-2 p-2 w-full"
          />
          <button className="bg-pink-500 text-white px-4 py-2 rounded w-full">
            Entrar
          </button>
        </form>
      </div>
    );
  }