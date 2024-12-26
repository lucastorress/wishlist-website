import React, { useState } from 'react';
import Router from 'next/router';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        // Redireciona para a dashboard
        Router.push('/admin');
      } else {
        alert("Usuário ou senha incorretos.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao fazer login.");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="border p-4 rounded" onSubmit={handleLogin}>
        <h1 className="text-xl font-bold mb-4">Login Admin</h1>
        <label className="block mb-2">
          Usuário:
          <input
            type="text"
            className="border w-full p-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="block mb-2">
          Senha:
          <input
            type="password"
            className="border w-full p-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
