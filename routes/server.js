// // 📁 server.js (Main Entry Point)
// const dotenv = require('dotenv');

// const express = require('express');
// // const dotenv = require('dotenv');
// const cookieParser = require('cookie-parser');
// const authRoutes = require('./routes/authRoutes');
// const projectRoutes = require('./routes/projectRoutes');
// const executiveRoutes = require('./routes/executiveRoutes');
// const customerRoutes = require('./routes/customer');


// dotenv.config();

// const cors = require("cors");


// // dotenv.config();
// const app = express();
// // app.use(cors({
// //   origin: "http://localhost:8081/", // frontend URL
// //   credentials: true,
// // })); 

// app.use(
//   cors({
//     origin: [
//       "http://localhost:8081", // Remove trailing slash
//       "http://192.168.1.4:8081", // Your network IP
//       "http://127.0.0.1:8081", // Alternative localhost
//       "exp://localhost:8081", // Expo development server
//       "exp://192.168.1.4:8081", // Expo network access
//       "http://localhost:3000", // Web development
//       "http://192.168.1.4:3000", // Web network access
//       "http://localhost:8000",
//       'http://localhost:5173',
//       "https://roongta.setlen.co.in/"
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: [
//       "Origin",
//       "X-Requested-With",
//       "Content-Type",
//       "Accept",
//       "Authorization",
//       "Cache-Control",
//       "Pragma",
//     ],
//     credentials: true,
//     optionsSuccessStatus: 200, // For legacy browser support
//   }),
// )


// app.use(express.json());
// app.use(cookieParser());
// app.get("/test", (req, res) => {
//   res.send("API Working");
// });
// app.use('/api', authRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/executives', executiveRoutes);
// app.use('/api', customerRoutes);

// const PORT = process.env.PORT || 8000;
// console.log("ENV DB_USER:", process.env.DB_USER); // Must print: eugsqdxo_vlc


// app.listen(PORT, () => {

//   console.log(`🚀 Server running on port ${PORT}`);

// });




// 📁 server.js (Main Entry Point)
const dotenv = require('dotenv');
dotenv.config(); // ✅ MUST be at the top before anything else

console.log("✅ JWT_SECRET from ENV:", process.env.JWT_SECRET); // Should not be undefined

const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const executiveRoutes = require('./routes/executiveRoutes');
const customerRoutes = require('./routes/customer');
const dashboardRoutes = require('./routes/dashboardRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');

const cors = require("cors");
// const path = require('path');


const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:8081",
      "http://192.168.1.4:8081",
      "http://127.0.0.1:8081",
      "exp://localhost:8081",
      "exp://192.168.1.4:8081",
      "http://localhost:3000",
      "http://192.168.1.4:3000",
      "http://localhost:8000",
      'http://localhost:5173',
      "https://roongta.setlen.co.in/"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Cache-Control",
      "Pragma",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(cookieParser());



app.get("/test", (req, res) => {
  res.send("API Working ✅");
});

app.use('/api', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/executives', executiveRoutes);
app.use('/api', customerRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/enquiry', enquiryRoutes);


// // ✅ Serve static frontend files
// app.use(express.static(path.join(__dirname, 'web-builders/dist')));

// // ✅ Handle frontend routes *after* API routes
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'web-builders/dist', 'index.html'));
// });

const PORT = process.env.PORT || 8000;
console.log("🚀 ENV DB_USER:", process.env.DB_USER); // Also verify DB env is loading

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
