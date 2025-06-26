const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.get('/popular-movies', async (req, res) => {
  try {
    const result = await prisma.post.groupBy({
      by: ['movieId'],
      where: {
        movieId: {
          not: null,
        },
      },
      _count: {
        movieId: true,
      },
      orderBy: {
        _count: {
          movieId: 'desc',
        },
      },
      take: 3,
    });

    res.json(result.map(item => ({
      movieId: item.movieId,
      count: item._count.movieId
    })));
  } catch (error) {
    console.error('Erro ao buscar filmes populares:', error);
    res.status(500).json({ error: 'Erro ao buscar filmes populares' });
  }
});

module.exports = router;