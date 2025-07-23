const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Redis = require('ioredis');
const redis = new Redis(); // Connects to localhost:6379 by default

// @desc Register a new user
// @route POST /api/register
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      name,
      email,
      password // Will be hashed in model via pre-save
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Login existing user
// @route POST /api/login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter email and password" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Access Token (15 mins)
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    // ✅ Refresh Token (7 days)
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ Store refresh token in DB
    user.refreshTokens.push(refreshToken);
    await user.save();

    // ✅ Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Return access token + user info
    res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Logout user and revoke tokens
// @route POST /api/logout
exports.logoutUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.split(' ')[1];
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken || !refreshToken) {
      return res.status(400).json({ message: 'Tokens missing' });
    }

    // ✅ Decode token to get expiry time
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const expiry = decoded.exp * 1000 - Date.now(); // ms TTL

    // ✅ Blacklist access token in Redis with TTL
    await redis.set(`bl_${accessToken}`, true, 'PX', expiry);

    // ✅ Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // ✅ Remove refresh token from user's DB record
    await User.findByIdAndUpdate(decoded.userId, {
      $pull: { refreshTokens: refreshToken }
    });

    res.status(200).json({ message: 'Logout successful' });

  } catch (err) {
    console.error('Logout error:', err.message);
    res.status(401).json({ message: 'Invalid token or session' });
  }
};
