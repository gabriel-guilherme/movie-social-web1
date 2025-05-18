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
  credentials: true // permite envio de cookies (sessão)
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

// Registro
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
      name: firstName + ' ' + lastName,
    }
  });

  const token = generateToken(newUser);
  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // true em produção com HTTPS
    maxAge: remember === 'on' ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
  });

  res.status(201).send('Usuário registrado com sucesso.');
});


// Login
app.post('/login', async (req, res) => {
  const { username, email, password, remember } = req.body;

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

// Verificação de login
app.get('/check-auth', authenticateToken, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

app.get('/me', authenticateToken, (req, res) => {
  const { name, email, username } = req.user;
  res.json({ name, email, username });
});

// Logout
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.send('Logout realizado com sucesso.');
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
