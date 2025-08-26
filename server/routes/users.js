const express = require('express');
const { auth, checkPermission } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get('/', checkPermission('read-auth-users'), async (req, res) => {
  try {
    res.json({ message: 'Users endpoint - to be implemented' });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
