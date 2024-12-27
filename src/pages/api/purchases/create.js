import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { itemId, buyerName, buyerPhone, quantity } = req.body;

    try {
      // Busca o item
      const item = await prisma.item.findUnique({
        where: { id: itemId },
      });
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      // Se item já está PURCHASED, podemos retornar erro
      if (item.status === 'PURCHASED') {
        return res.status(400).json({ error: 'Item já está vendido.' });
      }

      // Calcula valor total dessa compra
      const pricePerInstallment = item.price / item.installments;
      const amount = pricePerInstallment * quantity;

      // Cria a compra
      const purchase = await prisma.purchase.create({
        data: {
          buyerName,
          buyerPhone,
          quantity,
          amount,
          itemId,
        },
      });

      // Soma quantas cotas já foram compradas
      const result = await prisma.purchase.aggregate({
        where: { itemId },
        _sum: { quantity: true },
      });
      const totalCotasVendidas = result._sum.quantity || 0;

      // Se já bateu ou excedeu item.installments => marca como PURCHASED
      let newStatus = 'AVAILABLE';
      if (totalCotasVendidas >= item.installments) {
        newStatus = 'PURCHASED';
      }

      // Atualiza status do item
      await prisma.item.update({
        where: { id: itemId },
        data: {
          status: newStatus,
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
