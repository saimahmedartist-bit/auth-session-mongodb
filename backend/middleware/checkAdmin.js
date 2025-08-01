const User = require('../models/user'); // ✅ Adjust path if needed

// ✅ Middleware to check if user has admin role
module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('role');

    if (user && user.role === 'admin') {
      next(); // ✅ User is admin
    } else {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  } catch (error) {
    console.error('❌ Admin check failed:', error);
    return res.status(500).json({ message: 'Server error during role check' });
  }
};
