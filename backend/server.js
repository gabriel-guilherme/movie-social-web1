const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config({ path: './.env' });
const cors = require('cors');



const app = express();
const PORT = 3001;

// Configurações
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // permite envio de cookies (sessão)
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, 
    maxAge: 1000 * 60 * 60 * 24 // 1 dia
  }
}));

const usersFilePath = path.join(__dirname, 'data', 'users.json');

// Funções auxiliares
const loadUsers = () => {
    if (!fs.existsSync(usersFilePath)) return [];
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
};

const saveUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Rota de registro
app.post('/register', (req, res) => {
    const { email, password, 'first-name': firstName, 'last-name': lastName, 'remember-me': remember } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email e senha são obrigatórios.');
    }

    const users = loadUsers();
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
        return res.status(409).send('Usuário já existe.');
    }

    const newUser = {
        email,
        password, // HASH PASSWORD IN PRODUCTION
        firstName,
        lastName,
        remember: remember === 'on'
    };

    users.push(newUser);
    saveUsers(users);

    req.session.user = newUser;
    res.status(201).send('Usuário registrado com sucesso.');
});

// Rota de login
app.post('/login', (req, res) => {
    const { email, password, remember } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email e senha são obrigatórios.');
    }

    const users = loadUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).send('Credenciais inválidas.');
    }

    req.session.user = user;
    res.send('Login realizado com sucesso.');
});

// Rota de autenticação
app.get('/check-auth', (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// Rota de logout
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Erro ao fazer logout.');
        }
        res.clearCookie('connect.sid');
        res.send('Logout realizado com sucesso.');
    });
});

// Rota para recuperar informações do usuário
app.get('/me', (req, res) => {
  if (req.session && req.session.user) {
    const { firstName, lastName, email } = req.session.user;
    return res.json({ firstName, lastName, email });
  }

  return res.status(401).json({ error: 'Não autenticado' });
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
