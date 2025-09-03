const db = require('../config/db');
const bcrypt = require('bcryptjs');

const createManager = async (name, email, phone, password) => {
  const hashed = await bcrypt.hash(password, 10);
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO managers (name, email, phone, password) VALUES (?, ?, ?, ?)',
      [name, email, phone, hashed],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );  
  });
};

const findManagerByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM managers WHERE email = ?', [email], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

module.exports = {
  createManager,
  findManagerByEmail,
};
