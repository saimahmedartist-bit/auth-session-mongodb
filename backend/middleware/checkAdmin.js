const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware to check if user has admin role
module.exports = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { role: true }
    });

    if (user && user.role === 'admin') {
      next(); // ✅ User is admin, proceed
    } else {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  } catch (error) {
    console.error('Admin check failed:', error);
    return res.status(500).json({ message: 'Server error during role check' });
  }
};
