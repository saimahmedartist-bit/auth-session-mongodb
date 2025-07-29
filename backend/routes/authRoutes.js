const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const cookieParser = require('cookie-parser');

// ✅ Middleware
const verifyAccessToken = require('../middleware/verifyAccessToken');

// ✅ Controllers
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken // ✅ NEW import
} = require('../controllers/authController');

// ✅ Routes

// Register a new user
router.post('/register', registerUser);

// Login existing user
router.post('/login', loginUser);

// Access protected route
router.get('/protected', verifyAccessToken, (req, res) => {
  res.json({
    message: 'You are authenticated!',
    userId: req.userId
  });
});

// ✅ Refresh access token (uses controller logic and DB validation)
router.post('/refresh-token', refreshAccessToken);

// ✅ Logout route (blacklists access token and revokes refresh token)
router.post('/logout', logoutUser);

module.exports = router;
