const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { findManagerByEmail, createManager } = require('../models/managerModel');

const activeSessions = new Map(); // email -> token

const generateToken = (email, role) => {
  return jwt.sign({ email, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const setCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'lax',
  });
};

const registerManager = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existing = await findManagerByEmail(email);
    if (existing) return res.status(400).json({ error: 'Manager already exists' });

    await createManager(name, email, phone, password);
    res.status(201).json({ message: 'Manager registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // ✅ Admin check (hardcoded)
  if (email === 'admin@gmail.com' && password === 'admin1234') {
    const token = generateToken(email, 'admin');
    activeSessions.set(email, token);
    setCookie(res, token);
    return res.json({ message: 'Admin login successful', role: 'admin' });
  }

  // ✅ Manager login
  try {
    const manager = await findManagerByEmail(email);
    if (!manager) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, manager.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = generateToken(email, 'manager');
    activeSessions.set(email, token);
    setCookie(res, token);

    res.json({ message: 'Manager login successful',  token, role: 'manager' });
  } catch (err) {
    res.status(500).json({ error: 'Login error' });
  }
};

const logout = (req, res) => {
  const token = req.cookies.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    activeSessions.delete(decoded.email);
  } catch {}
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

module.exports = {
  registerManager,
  login,
  logout,
  activeSessions,
};

