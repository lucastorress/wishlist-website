export default function AdminPanel({ items, addItem, editItem, deleteItem }) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Painel Administrativo</h2>
        <button
          onClick={addItem}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4">
          Adicionar Item
        </button>
        <ul>
          {items.map((item) => (
            <li key={item.id} className="border p-2 mb-2 flex justify-between">
              <span>{item.title} - R${item.price}</span>
              <div>
                <button
                  onClick={() => editItem(item.id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                  Editar
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded">
                  Apagar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }