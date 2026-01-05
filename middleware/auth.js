const jwt = require('jsonwebtoken');

// Simple JWT auth middleware. Expects Authorization: Bearer <token>
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { role: 'admin', username, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid or expired' });
  }
};

module.exports = auth;

