import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    if (!req.headers.cookie?.includes('adminToken=123456')) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const { title, price, link, imageUrl } = req.body;
    try {
      const prisma = new PrismaClient();
      const newItem = await prisma.item.create({
        data: {
          title,
          price,
          link,
          imageUrl,
        },
      });
      return res.status(200).json(newItem);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error creating item' });
    }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
