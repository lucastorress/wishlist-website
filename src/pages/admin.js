import AdminLogin from '../components/AdminLogin';
import AdminPanel from '../components/AdminPanel';
import { useState } from 'react';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [items, setItems] = useState(mockItems);

  const addItem = () => {
    const newItem = { id: Date.now(), title: 'Novo Item', price: 0, link: '' };
    setItems([...items, newItem]);
  };

  const editItem = (id) => {
    // Editing logic
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return isLoggedIn ? (
    <AdminPanel
      items={items}
      addItem={addItem}
      editItem={editItem}
      deleteItem={deleteItem}
    />
  ) : (
    <AdminLogin onLogin={() => setIsLoggedIn(true)} />
  );
}
