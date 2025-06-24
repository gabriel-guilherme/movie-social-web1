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

// Posts
// Rota para criar um novo post
app.post('/posts', async (req, res) => {
  const { content, authorId } = req.body; // Dados do post enviados pelo frontend

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        author: {
          connect: { id: authorId } // Conecta o post a um usuário existente
        }
      },
    });
    res.status(201).json(newPost); // Retorna o post criado
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ error: 'Erro ao criar post no banco de dados.' });
  }
});

// Rota para buscar todos os posts (ou posts de um usuário específico)
app.get('/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true // Inclui os dados do autor em cada post
      },
      orderBy: {
        id: 'desc' // Ordena para mostrar os mais recentes primeiro
      }
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({ error: 'Erro ao buscar posts do banco de dados.' });
  }
});

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

app.get('/me', authenticateToken, async (req, res) => { // Adicione 'async' aqui
  // O ID do usuário deve vir do token decodificado pelo authenticateToken
  const userEmail = req.user.email; // Assegure que req.user.id existe e é o ID do usuário no DB

  if (!userEmail) {
    return res.status(401).json({ error: 'ID do usuário não encontrado no token.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      // Selecione apenas os campos que você quer retornar
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        // Não inclua a senha por segurança!
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    console.log('Usuário puxado do BD:', user); // Log para depuração
    res.json(user); // Retorna os dados do usuário puxados do DB
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao buscar usuário.' });
  }
});

// Logout
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.send('Logout realizado com sucesso.');
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
