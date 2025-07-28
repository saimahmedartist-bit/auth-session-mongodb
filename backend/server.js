const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // ✅ Needed for refreshToken handling
const authRoutes = require('./routes/authRoutes'); // ✅ Your authentication routes

console.log("🟡 Starting server.js");

dotenv.config();
console.log("✅ .env loaded");

const app = express();

// ✅ Middleware setup
app.use(cors({
  origin: 'http://localhost:3000', // Adjust based on frontend
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

// ✅ API routes
app.use('/api', authRoutes);

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('API Running ✅');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
