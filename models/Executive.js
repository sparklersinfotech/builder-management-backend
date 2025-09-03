// // models/Executive.js
// const db = require('../config/db');

// const Executive = {
//   create: async ({ full_name, mobile, email, designation }) => {
//     const [result] = await db.query(
//       'INSERT INTO executives (full_name, mobile, email, designation) VALUES (?, ?, ?, ?)',
//       [full_name, mobile, email, designation]
//     );
//     return result;
//   },

//   findByEmailOrMobile: async (email, mobile) => {
//     const [rows] = await db.query(
//       'SELECT * FROM executives WHERE email = ? OR mobile = ?',
//       [email, mobile]
//     );
//     return rows;
//   },

//   getAll: async () => {
//     const [rows] = await db.query('SELECT * FROM executives ORDER BY id DESC');
//     return rows;
//   },

//   update: async (id, data) => {
//     const [result] = await db.query(
//       'UPDATE executives SET full_name = ?, mobile = ?, email = ?, designation = ? WHERE id = ?',
//       [data.full_name, data.mobile, data.email, data.designation, id]
//     );
//     return result;
//   },

//   delete: async (id) => {
//     const [result] = await db.query('DELETE FROM executives WHERE id = ?', [id]);
//     return result;
//   }
// };

// module.exports = Executive;


const db = require('../config/db');

const Executive = {
  // Create a new executive
  create: async ({ full_name, mobile, email, designation }) => {
    try {
      const [result] = await db.query(
        'INSERT INTO executives (full_name, mobile, email, designation) VALUES (?, ?, ?, ?)',
        [full_name, mobile, email, designation]
      );
      return result;
    } catch (err) {
      throw new Error('Database insert failed: ' + err.message);
    }
  },

  // Find executive by email or mobile
  findByEmailOrMobile: async (email, mobile) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM executives WHERE email = ? OR mobile = ?',
        [email, mobile]
      );
      return rows;
    } catch (err) {
      throw new Error('Database lookup failed: ' + err.message);
    }
  },

  // Get all executives
  getAll: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM executives ORDER BY id DESC');
      return rows;
    } catch (err) {
      throw new Error('Fetching all executives failed: ' + err.message);
    }
  },

  // Update executive by ID
  update: async (id, { full_name, mobile, email, designation }) => {
    try {
      const [result] = await db.query(
        'UPDATE executives SET full_name = ?, mobile = ?, email = ?, designation = ? WHERE id = ?',
        [full_name, mobile, email, designation, id]
      );
      return result;
    } catch (err) {
      throw new Error('Database update failed: ' + err.message);
    }
  },

  // Delete executive by ID
  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM executives WHERE id = ?', [id]);
      return result;
    } catch (err) {
      throw new Error('Database delete failed: ' + err.message);
    }
  }
};

module.exports = Executive;

