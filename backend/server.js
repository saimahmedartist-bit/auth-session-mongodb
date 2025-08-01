// ✅ Imports
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// ✅ Load environment variables
dotenv.config();
console.log("✅ .env loaded");

// ✅ Initialize Express app
const app = express();

// ✅ Middleware configuration
app.use(cors({
  origin: 'http://localhost:3000', // 🔁 Update for production
  credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());

// ✅ MongoDB connection (cleaned: removed deprecated options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ✅ Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes); // Auth routes: /register, /login, etc.

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('🚀 API is running...');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
