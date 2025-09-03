// const db = require('../config/db');

// const findAdminByEmail = (email) => {
//   return new Promise((resolve, reject) => {
//     db.query('SELECT * FROM admins WHERE email = ?', [email], (err, results) => {
//       if (err) return reject(err);
//       resolve(results[0]);
//     });
//   });
// };

// module.exports = { findAdminByEmail };

// const db = require('../config/db');

// // Admin find by email
// const findAdminByEmail = (email) => {
//   return new Promise((resolve, reject) => {
//     db.query('SELECT * FROM admins WHERE email = ?', [email], (err, results) => {
//       if (err) return reject(err);
//       resolve(results[0]);
//     });
//   });
// };

// // Admin create (register)
// const createAdmin = (email, hashedPassword) => {
//   return new Promise((resolve, reject) => {
//     db.query(
//       'INSERT INTO admins (email, password) VALUES (?, ?)',
//       [email, hashedPassword],
//       (err, results) => {
//         if (err) return reject(err);
//         resolve(results);
//       }
//     );
//   });
// };

// module.exports = { findAdminByEmail, createAdmin };


const db = require('../config/db');

// Admin find by email
const findAdminByEmail = async (email) => {
  try {
    const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    return rows[0]; // Return single admin
  } catch (err) {
    throw err;
  }
};

// Admin create (register)
const createAdmin = async (email, hashedPassword) => {
  try {
    const [result] = await db.query(
      'INSERT INTO admins (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    return result;
  } catch (err) {
    throw err;
  }
};

module.exports = { findAdminByEmail, createAdmin };
