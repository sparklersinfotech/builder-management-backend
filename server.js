
// Load env first
const dotenv = require('dotenv');
dotenv.config();

console.log("✅ JWT_SECRET from ENV:", process.env.JWT_SECRET);

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const path = require('path');

// Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const executiveRoutes = require('./routes/executiveRoutes');
const customerRoutes = require('./routes/customer');
const dashboardRoutes = require('./routes/dashboardRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const app = express();

// ✅ CORS Setup
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
      "http://localhost:5173",
      "https://roongta.setlen.co.in"
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

// ✅ Test Route
app.get("/api/test", (req, res) => {
  res.send("API Working ✅");
});

// ✅ API Routes
app.use('/api', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/executives', executiveRoutes);
app.use('/api', customerRoutes);
app.use('/api', dashboardRoutes);
app.use('/api',enquiryRoutes );

// ✅ Serve React build (after API routes only)
app.use(express.static(path.join(__dirname, 'web-builders/dist')));

// ✅ Handle frontend routes
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'web-builders/dist', 'index.html'));
// });

// ✅ Start Server
const PORT = process.env.PORT || 8000;
console.log("🚀 ENV DB_USER:", process.env.DB_USER);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
