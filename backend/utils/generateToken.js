const jwt = require('jsonwebtoken');

module.exports = function generateToken(user) {
  return jwt.sign(
    { username: user.username, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};
