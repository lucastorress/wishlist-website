import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;
    if (id) {
      // Busca item específico
      const item = await prisma.item.findUnique({ where: { id: parseInt(id) } });
      return res.status(200).json({ items: [item] });
    } else {
      // Lista todos
      const items = await prisma.item.findMany();
      return res.status(200).json({ items });
    }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
