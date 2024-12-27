import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ error: 'Nome da categoria é obrigatório.' });
    }
    try {
      const category = await prisma.category.create({
        data: { name: name.trim() },
      });
      return res.status(200).json({ category });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar categoria' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
