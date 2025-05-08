const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;


app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(express.static(path.join(__dirname, '..', 'frontend', 'src')));

const usersFilePath = path.join(__dirname, 'users.json');


app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'src', 'pages', 'register.html'));
});


app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'src', 'pages', 'login.html'));
});


app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'src', 'pages', 'home.html'));
});


app.post('/register', (req, res) => {
    const {
        "first-name": firstName,
        "last-name": lastName,
        email,
        password
    } = req.body;

    let users = [];

    // Lê usuários já registrados, se houver
    if (fs.existsSync(usersFilePath)) {
        const data = fs.readFileSync(usersFilePath);
        users = JSON.parse(data);
    }

    // Verifica se o usuário já existe
    const exists = users.find(user => user.email === email);
    if (exists) {
        return res.status(400).send('Usuário já existe');
    }

    // Adiciona novo usuário
    users.push({
        firstName,
        lastName,
        email,
        password
    });

    // Salva no arquivo
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    // Redireciona para home com nome e sobrenome
    res.redirect('/home.html?email=' + encodeURIComponent(email) +
        '&nome=' + encodeURIComponent(firstName) +
        '&sobrenome=' + encodeURIComponent(lastName));
});


app.post('/login', (req, res) => {
    const {
        email,
        password
    } = req.body;

    // Verifica se há arquivo de usuários
    if (!fs.existsSync(usersFilePath)) {
        return res.redirect('/login.html?error=true');
    }

    const data = fs.readFileSync(usersFilePath);
    const users = JSON.parse(data);

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Redireciona com nome e sobrenome também
        res.redirect('/home.html?email=' + encodeURIComponent(user.email) +
            '&nome=' + encodeURIComponent(user.firstName) +
            '&sobrenome=' + encodeURIComponent(user.lastName));
    } else {
        res.redirect('/login.html?error=true');
    }
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});