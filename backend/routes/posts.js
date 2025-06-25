const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.post('/posts', async (req, res) => {
  const { content, authorId } = req.body;

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        author: { connect: { id: authorId } },
        likes: 0
      }
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ error: 'Erro ao criar post.' });
  }
});

router.get('/posts', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const userId = parseInt(req.query.userId);

  try {
    const posts = await prisma.post.findMany({
      skip: offset,
      take: limit,
      include: {
        author: true,
        likedBy: {
          where: { userId },
          select: { userId: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = posts.map(post => ({
      id: post.id,
      authorId: post.authorId,
      name: post.author.username,
      content: post.content,
      likes: post.likes,
      createdAt: post.createdAt,
      liked: post.likedBy.length > 0
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({ error: 'Erro ao buscar posts.' });
  }
});

module.exports = router;
