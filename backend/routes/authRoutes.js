const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const cookieParser = require('cookie-parser');

// ✅ Middleware
const verifyAccessToken = require('../middleware/verifyAccessToken');
const checkAdmin = require('../middleware/checkAdmin'); // ✅ NEW middleware

// ✅ Controllers
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getAllUsersPaginated, // ✅ NEW controller function
} = require('../controllers/authController');

// ✅ Routes

// Register a new user
router.post('/register', registerUser);

// Login existing user
router.post('/login', loginUser);

// Protected route
router.get('/protected', verifyAccessToken, (req, res) => {
  res.json({
    message: 'You are authenticated!',
    userId: req.userId,
  });
});

// Refresh access token
router.post('/refresh-token', refreshAccessToken);

// Logout
router.post('/logout', logoutUser);

// ✅ Admin-only paginated user listing route
router.get('/users', verifyAccessToken, checkAdmin, getAllUsersPaginated);

module.exports = router;
