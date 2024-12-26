import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { itemId, buyerName, buyerPhone, amount } = req.body;

    try {
      const prisma = new PrismaClient();

      // Cria o registro da compra
      const purchase = await prisma.purchase.create({
        data: {
          buyerName,
          buyerPhone,
          amount,
          itemId: itemId,
        }
      });

      // Atualiza o status do item para PURCHASED
      await prisma.item.update({
        where: { id: itemId },
        data: {
          status: 'PURCHASED',
        },
      });

      return res.status(200).json({ purchase });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar compra' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
