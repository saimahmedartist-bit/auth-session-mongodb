const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // ✅ Added
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

console.log("🟡 Starting server.js");

dotenv.config();
console.log("✅ .env loaded");

// MongoDB connection
connectDB();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // ✅ adjust this to your frontend domain
  credentials: true, // ✅ allow cookies from frontend
}));
app.use(bodyParser.json());
app.use(cookieParser()); // ✅ required to read refreshToken from cookie

// API Routes
app.use('/api', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API Running ✅');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
