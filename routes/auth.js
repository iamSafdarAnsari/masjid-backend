const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Use sensible development defaults if env vars are not set
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456';
const JWT_SECRET = process.env.JWT_SECRET || 'development-only-secret';

if (!process.env.JWT_SECRET) {
  console.warn('[auth] JWT_SECRET is not set. Using a development-only fallback secret.');
}
if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
  console.warn(
    '[auth] ADMIN_USERNAME or ADMIN_PASSWORD is not set. Using default admin / 123456 for development.'
  );
}

// POST /api/auth/login
// Body: { username, password }
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const payload = {
    role: 'admin',
    username,
  };

  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.json({ token });
  } catch (err) {
    console.error('Error generating JWT:', err);
    return res.status(500).json({ message: 'Failed to generate token' });
  }
});

module.exports = router;
