const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Create payment intent
// @route   POST /api/payment/create-intent
// @access  Private
router.post('/create-intent', protect, async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        message: 'Payment processing will be implemented here'
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;