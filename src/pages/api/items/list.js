import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  // Exemplo de check de auth a partir de cookie
  if (!req.headers.cookie?.includes('adminToken=123456')) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  const prisma = new PrismaClient();

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
