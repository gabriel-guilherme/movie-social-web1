const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.post('/posts/:id/like', async (req, res) => {
  const postId = parseInt(req.params.id);
  const userId = req.body.userId;

  try {
    const alreadyLiked = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } }
    });

    if (alreadyLiked) {
      return res.status(400).json({ error: "Usuário já curtiu este post." });
    }

    await prisma.like.create({ data: { userId, postId } });
    await prisma.post.update({
      where: { id: postId },
      data: { likes: { increment: 1 } }
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('Erro ao curtir:', error);
    res.status(500).json({ error: "Erro ao curtir post." });
  }
});

router.delete('/posts/:id/like', async (req, res) => {
  const postId = parseInt(req.params.id);
  const userId = req.body.userId;

  try {
    await prisma.like.delete({
      where: { userId_postId: { userId, postId } }
    });

    await prisma.post.update({
      where: { id: postId },
      data: { likes: { decrement: 1 } }
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('Erro ao remover like:', error);
    res.status(500).json({ error: "Erro ao remover like." });
  }
});

module.exports = router;
