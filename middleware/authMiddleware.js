const jwt = require('jsonwebtoken');
const { activeSessions } = require('../controllers/authController');

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const current = activeSessions.get(decoded.email);
    if (current !== token) return res.status(401).json({ error: 'Session expired or logged in elsewhere' });

    req.user = decoded; // { email, role }
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { authenticate };
