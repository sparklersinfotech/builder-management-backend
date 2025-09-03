const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { findAdminByEmail, createAdmin } = require('../models/adminModel');


const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('❌ JWT_SECRET is not set in .env file');
  }
  return process.env.JWT_SECRET;
};

// Generate JWT token for admin
const generateToken = (email, role) => {
  console.log("JWT_SECRET:", process.env.JWT_SECRET); // Debug line
  return jwt.sign({ email, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};


// Set token in HTTP-only cookie
const setCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  });
};


const adminLogin = async (req, res) => {
  console.log("Request received");

  const { email, password } = req.body;
  if (!email || !password) {
    console.log("Missing credentials");
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const admin = await findAdminByEmail(email);
    console.log("Admin found:", admin);

    if (!admin) {
      console.log("Invalid email");
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      console.log("Password mismatch");
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(email, 'admin');
    setCookie(res, token);
    console.log("Login success");

    res.json({
      message: 'Admin login successful',
      role: 'admin',
      token,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: 'Login error' });
  }


};



// 🆕 Admin Register Controller
const adminRegister = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const existing = await findAdminByEmail(email);
    if (existing) return res.status(400).json({ error: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await createAdmin(email, hashedPassword);
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration error' });
  }
  
};


module.exports = { adminLogin, adminRegister };
