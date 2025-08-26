const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/companies
// @desc    Get user companies
// @access  Private
router.get('/', async (req, res) => {
  try {
    res.json({ companies: req.user.companies || [] });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
