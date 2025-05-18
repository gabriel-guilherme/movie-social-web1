//const path = require('path');
//const fs = require('fs');
//const bodyParser = require('body-parser');
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

// Configurações
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // permite envio de cookies (sessão)
}));

app.use(express.json());
app.use(cookieParser());

//const usersFilePath = path.join(__dirname, 'data', 'users.json');

/*// Funções auxiliares
const loadUsers = () => {
    if (!fs.existsSync(usersFilePath)) return [];
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
};*/

/*const saveUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};*/

const generateToken = (user) => {
  return jwt.sign(
    { email: user.email, firstName: user.firstName, lastName: user.lastName },
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
  const { email, password, 'first-name': firstName, 'last-name': lastName, 'remember-me': remember } = req.body;

  if (!email || !password) return res.status(400).send('Email e senha são obrigatórios.');

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(409).send('Usuário já existe.');

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName
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

// Verificação de login
app.get('/check-auth', authenticateToken, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

app.get('/me', authenticateToken, (req, res) => {
  const { firstName, lastName, email } = req.user;
  res.json({ firstName, lastName, email });
});

// Logout
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.send('Logout realizado com sucesso.');
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
