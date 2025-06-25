const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const generateToken = require('../utils/generateToken');
const authenticateToken = require('../middleware/authenticateToken');

const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
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

router.post('/login', async (req, res) => {
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

router.get('/check-auth', authenticateToken, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

router.get('/me', authenticateToken, async (req, res) => {
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

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.send('Logout realizado com sucesso.');
});

module.exports = router;
