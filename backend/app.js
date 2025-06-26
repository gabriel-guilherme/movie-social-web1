const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const likeRoutes = require('./routes/likes');
const trendsRoutes = require('./routes/trends');
const watched = require('./routes/watched');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use(authRoutes);
app.use(postRoutes);
app.use(likeRoutes);
app.use(trendsRoutes);
app.use(watched)

module.exports = app;
