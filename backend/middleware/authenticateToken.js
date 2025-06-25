const jwt = require('jsonwebtoken');

module.exports = function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ authenticated: false });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch {
    return res.status(403).json({ authenticated: false, error: 'Token inválido' });
  }
};
