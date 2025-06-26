const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.post('/posts', async (req, res) => {
  const { content, authorId, movieId } = req.body;

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        authorId,
        movieId: movieId || null,
      },
    });
    res.json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar post." });
  }
});

router.get('/posts', async (req, res) => {
  const { limit = 10, offset = 0, userId } = req.query;

  try {
    const posts = await prisma.post.findMany({
      skip: parseInt(offset),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        likedBy: {
          where: { userId: parseInt(userId) },
        },
      },
    });

    const result = posts.map(post => ({
      id: post.id,
      content: post.content,
      name: post.author.username,
      createdAt: post.createdAt,
      likes: post.likes,
      liked: post.likedBy.length > 0,
      movieId: post.movieId,
      authorId: post.authorId,
    }));

    res.json(result);
  } catch (err) {
    console.error("Erro ao buscar posts:", err);
    res.status(500).json({ error: "Erro ao buscar posts." });
  }
});


module.exports = router;
