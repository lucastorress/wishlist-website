let items = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(items);
  } else if (req.method === 'POST') {
    const newItem = req.body;
    items.push(newItem);
    res.status(201).json(newItem);
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    items = items.filter((item) => item.id !== id);
    res.status(200).json({ message: 'Item deleted' });
  }
}