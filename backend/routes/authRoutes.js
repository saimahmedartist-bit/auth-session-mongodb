const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser // ✅ Import logout controller
} = require('../controllers/authController');

const verifyAccessToken = require('../middleware/verifyAccessToken');

// ✅ Register new user
router.post('/register', registerUser);

// ✅ Login existing user and issue tokens
router.post('/login', loginUser);

// ✅ Access protected route (requires valid access token)
router.get('/protected', verifyAccessToken, (req, res) => {
  res.json({
    message: 'You are authenticated!',
    userId: req.userId
  });
});

// ✅ Refresh access token using refresh token cookie
router.post('/refresh-token', (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401); // No token, Unauthorized

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // Invalid token, Forbidden

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ token: newAccessToken });
  });
});

// ✅ Proper logout: calls logoutUser controller
router.post('/logout', logoutUser);

module.exports = router;
