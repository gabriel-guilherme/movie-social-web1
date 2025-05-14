const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

require('dotenv').config({
    path: '../.env'
});

const app = express();
const PORT = 3001;


app.use(bodyParser.urlencoded({
    extended: true
}));

const session = require('express-session');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false    
}));

const usersFilePath = path.join(__dirname, 'data', 'users.json');


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});