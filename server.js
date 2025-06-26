const express = require('express');
require('dotenv').config({ path: './.env' });
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const generateToken = (user) => {
  return jwt.sign(
    { username: user.username, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ authenticated: false });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ authenticated: false, error: 'Token inválido' });
  }
};



app.post('/posts', async (req, res) => {
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

app.get('/posts', async (req, res) => {
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



app.post('/posts/:id/like', async (req, res) => {
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

app.delete('/posts/:id/like', async (req, res) => {
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



app.post('/register', async (req, res) => {
  const { username, email, password, 'first-name': firstName, 'last-name': lastName, 'remember-me': remember } = req.body;

  if (!email || !password) return res.status(400).send('Email e senha são obrigatórios.');

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) return res.status(409).send('Email já existe.');

  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) return res.status(409).send('Nome de usuário já existe.');

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`
    }
  });

  const token = generateToken(newUser);
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    maxAge: remember === 'on' ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
  });

  res.status(201).send('Usuário registrado com sucesso.');
});

app.post('/login', async (req, res) => {
  const { email, password, remember } = req.body;

  if (!email || !password) return res.status(400).send('Email e senha são obrigatórios.');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Credenciais inválidas.');
  }

  const token = generateToken(user);
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    maxAge: remember === 'on' ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
  });

  res.send('Login realizado com sucesso.');
});

app.get('/check-auth', authenticateToken, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

app.get('/me', authenticateToken, async (req, res) => {
  const userEmail = req.user.email;
  if (!userEmail) return res.status(401).json({ error: 'Token inválido.' });

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        createdAt: true
      }
    });

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.send('Logout realizado com sucesso.');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
