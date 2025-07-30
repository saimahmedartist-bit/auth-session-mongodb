const express = require('express');
const router = express.Router();

const verifyAccessToken = require('../middleware/verifyAccessToken');
const checkAdmin = require('../middleware/checkAdmin');

const { getAllUsers } = require('../controllers/userController');

// ✅ Admin-only route to get users with pagination
router.get('/users', verifyAccessToken, checkAdmin, getAllUsers);

module.exports = router;
