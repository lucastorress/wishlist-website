import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { id, title, price, link, imageUrl, status, categoryId } = req.body;

    try {
      // 1. Busca o item antigo
      const oldItem = await prisma.item.findUnique({
        where: { id },
        include: { purchases: true },
      });
      if (!oldItem) {
        return res.status(404).json({ error: 'Item not found' });
      }

      const oldStatus = oldItem.status;

      // 2. Atualiza o item
      const updatedItem = await prisma.item.update({
        where: { id },
        data: {
          title,
          price,
          link,
          imageUrl,
          status,
          categoryId,
        },
      });

      // 3. Se mudamos de PURCHASED -> AVAILABLE, desativamos as compras antigas
      if (oldStatus === 'PURCHASED' && status === 'AVAILABLE') {
        // Arquivar compras
        await prisma.purchase.updateMany({
          where: { itemId: id, active: true },
          data: { active: false },
        });
      }

      return res.status(200).json(updatedItem);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error updating item' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}