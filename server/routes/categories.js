const express = require('express');
const Category = require('../models/Category');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .populate('children');

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get category tree
// @route   GET /api/categories/tree
// @access  Public
router.get('/tree', async (req, res, next) => {
  try {
    const tree = await Category.getCategoryTree();
    res.json({
      success: true,
      data: { categories: tree }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;