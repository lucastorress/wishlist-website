import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
      });
      return res.status(200).json({ categories });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar categorias' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
