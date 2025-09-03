// const db = require('../config/db');

// const addProject = (name, address, type) => {
//   return new Promise((resolve, reject) => {
//     const query = 'INSERT INTO projects (name, address, type) VALUES (?, ?, ?)';
//     db.query(query, [name, address, type], (err, result) => {
//       if (err) return reject(err);
//       resolve(result);
//     });
//   });
// };

// module.exports = { addProject };
    

const db = require('../config/db');

const addProject = async (name, address, type) => {
  const [result] = await db.query(
    'INSERT INTO projects (name, address, type) VALUES (?, ?, ?)',
    [name, address, type]
  );
  return result;
};

module.exports = { addProject };
