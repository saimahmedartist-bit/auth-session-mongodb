const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // ✅ Needed for refresh token handling
const authRoutes = require('./routes/authRoutes'); // ✅ Your route handlers
const { PrismaClient } = require('@prisma/client');

console.log("🟡 Starting server.js");

dotenv.config(); // ✅ Load environment variables
console.log("✅ .env loaded");

// Initialize Express app
const app = express();

// ✅ Middleware configuration
app.use(cors({
  origin: 'http://localhost:3000', // Replace with frontend domain in production
  credentials: true // ✅ Allow cookies from frontend
}));
app.use(bodyParser.json());
app.use(cookieParser());

// ✅ API route mounting
app.use('/api', authRoutes);

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('API Running ✅');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
