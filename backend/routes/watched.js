// routes/watched.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Sem autenticação middleware

router.post('/watched', async (req, res) => {
  const { userId, movieId } = req.body;

  if (!userId) return res.status(400).json({ error: "userId é obrigatório" });
  if (!movieId) return res.status(400).json({ error: "movieId é obrigatório" });

  try {
    const watched = await prisma.watchedMovie.upsert({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
      update: {},
      create: {
        userId,
        movieId,
      },
    });

    res.json(watched);
  } catch (error) {
    console.error("Erro ao adicionar filme assistido", error);
    res.status(500).json({ error: "Erro ao adicionar filme assistido" });
  }
});

router.get('/watched', async (req, res) => {
  // Pode receber userId via query param para filtrar
  const userId = parseInt(req.query.userId);

  if (!userId) return res.status(400).json({ error: "userId é obrigatório" });

  try {
    const watchedMovies = await prisma.watchedMovie.findMany({
      where: { userId },
      orderBy: { watchedAt: 'desc' },
    });

    res.json(watchedMovies);
  } catch (error) {
    console.error("Erro ao buscar lista de assistidos", error);
    res.status(500).json({ error: "Erro ao buscar lista de assistidos" });
  }
});

router.delete('/watched/:movieId', async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const userId = parseInt(req.query.userId);

  if (!userId) return res.status(400).json({ error: "userId é obrigatório" });

  try {
    await prisma.watchedMovie.delete({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
    });

    res.json({ message: "Filme removido da lista de assistidos" });
  } catch (error) {
    console.error("Erro ao remover filme assistido", error);
    res.status(500).json({ error: "Erro ao remover filme assistido" });
  }
});

module.exports = router;
