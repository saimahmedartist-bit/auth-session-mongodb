const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const Redis = require('ioredis');

const prisma = new PrismaClient();
const redis = new Redis();

// @desc Register a new user
// @route POST /api/register
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Login user (Raw SQL)
// @route POST /api/login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log("🟢 Login attempt:", { email, password });

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter email and password" });
  }

  try {
    // ✅ FIXED: Table name is "User" with quotes
    const userResult = await prisma.$queryRaw`SELECT * FROM "User" WHERE email = ${email}`;
    console.log("🔍 Query result:", userResult);

    const user = userResult[0];

    if (!user) {
      console.log("❌ No user found for email:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔐 Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userId: user.id,
      },
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Refresh access token
// @route POST /api/refresh-token
exports.refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const dbToken = await prisma.refreshToken.findFirst({
      where: {
        token,
        revoked: false,
        userId: decoded.userId,
        expires_at: {
          gt: new Date(),
        },
      },
    });

    if (!dbToken) {
      return res.status(403).json({ message: 'Refresh token is invalid or expired' });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error('Refresh error:', err.message);
    res.status(403).json({ message: 'Invalid refresh token' });
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

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const expiry = decoded.exp * 1000 - Date.now();

    await redis.set(`bl_${accessToken}`, true, 'PX', expiry);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true },
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err.message);
    res.status(401).json({ message: 'Invalid token or session' });
  }
};

// @desc Get all users (admin-only) with pagination
// @route GET /api/users?page=1&limit=10
exports.getAllUsersPaginated = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    // ✅ FIXED: Use quoted PascalCase table name "User"
    const users = await prisma.$queryRaw`
      SELECT id, name, email, role FROM "User"
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await prisma.$queryRaw`SELECT COUNT(*) FROM "User"`;
    const total = parseInt(countResult[0].count);

    res.status(200).json({
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
