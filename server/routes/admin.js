const express = require('express');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', protect, admin, async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        message: 'Admin dashboard data will be implemented here'
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;