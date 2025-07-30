const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc Get all users with pagination (admin only)
// @route GET /api/users?page=1&limit=10
exports.getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const users = await prisma.$queryRaw`
      SELECT id, name, email, role, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const total = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS total FROM users
    `;

    res.status(200).json({
      page,
      limit,
      total: total[0].total,
      users
    });
  } catch (err) {
    console.error("Pagination error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
