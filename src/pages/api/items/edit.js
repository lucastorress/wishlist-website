import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    if (!req.headers.cookie?.includes('adminToken=123456')) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const { id, title, price, installments, link, imageUrl, status, categoryId } = req.body;

    try {
      const updatedItem = await prisma.item.update({
        where: { id },
        data: {
          title,
          price,
          installments,
          link,
          imageUrl,
          status,
          categoryId,
        },
      });
      return res.status(200).json(updatedItem);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error updating item' });
    }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
