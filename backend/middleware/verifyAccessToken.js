const jwt = require('jsonwebtoken');
const Redis = require('ioredis');
const redis = new Redis();

const verifyAccessToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) return res.sendStatus(401); // Unauthorized

  try {
    // ✅ Check Redis for blacklist
    const isBlacklisted = await redis.get(`bl_${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Access token is blacklisted' });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' }); // Forbidden
  }
};

module.exports = verifyAccessToken;
