export default function ItemCard({ item }) {
    return (
      <div className="border p-4 rounded bg-white shadow-sm hover:shadow-md">
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
    );
  }