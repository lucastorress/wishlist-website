import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    if (!req.headers.cookie?.includes('adminToken=123456')) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const { id } = req.body;
    try {
      const prisma = new PrismaClient();
      await prisma.item.delete({ where: { id } });
      return res.status(200).json({ message: 'Item deleted' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error deleting item' });
    }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
