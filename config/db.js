

const mysql = require('mysql2/promise'); // Changed to promise version
// const dotenv = require('dotenv');         

// dotenv.config();


process.env.JWT_SECRET = 'mySuperSecretKey123'; // Same as in your .env
process.env.JWT_EXPIRES_IN = '1d'; // Same as in your .env
process.env.PORT = 8000; // Optional, if needed



console.log("DB CONFIG:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Create a connection pool instead of single connection
// const pool = mysql.createPool({
//   host: 'localhost',
// user: 'eugsqdxo_vlc',
// password: 'vlcSpark20@%',
// database: 'eugsqdxo_builder',
//   waitForConnections: true,
//   connectionLimit: 10, // Adjust based on your needs
//   queueLimit: 0
// });

const pool = mysql.createPool({
  host: 'localhost',
user: 'root',
password: '',
database: 'manager_app',
  waitForConnections: true,
  connectionLimit: 10, // Adjust based on your needs
  queueLimit: 0 
});

// const pool = mysql.createPool({
//   host: 'localhost',
// user: 'eugsqdxo_buildvl',
// password: 'vlcSpark20@%',
// database: 'eugsqdxo_build',
//   waitForConnections: true,
//   connectionLimit: 10, // Adjust based on your needs
//   queueLimit: 0
// });

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Connected to MySQL as ID ' + connection.threadId);
    connection.release(); // Release the connection back to the pool
  })
  .catch(err => {
    console.error('Database connection failed:', err.stack);
  });

module.exports = pool;