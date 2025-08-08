const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { protect, admin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isIn(['name', 'price', 'rating', 'createdAt']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be non-negative'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be non-negative'),
  query('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5')
], optionalAuth, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 12,
      search,
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStock,
      onSale,
      featured,
      tags,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    if (subcategory) {
      filter.subcategory = subcategory;
    }

    // Brand filter
    if (brand) {
      filter.brand = { $regex: brand, $options: 'i' };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Rating filter
    if (rating) {
      filter['ratings.average'] = { $gte: parseFloat(rating) };
    }

    // Stock filter
    if (inStock === 'true') {
      filter['inventory.stock'] = { $gt: 0 };
    }

    // Sale filter
    if (onSale === 'true') {
      filter.onSale = true;
    }

    // Featured filter
    if (featured === 'true') {
      filter.featured = true;
    }

    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }

    // Build sort object
    const sort = {};
    if (search && !sortBy) {
      sort.score = { $meta: 'textScore' };
    } else {
      const sortField = sortBy === 'rating' ? 'ratings.average' : sortBy;
      sort[sortField] = sortOrder === 'asc' ? 1 : -1;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalProducts / parseInt(limit));
    const hasNext = parseInt(page) < totalPages;
    const hasPrev = parseInt(page) > 1;

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages,
          totalItems: totalProducts,
          hasNext,
          hasPrev
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .populate('reviews.user', 'firstName lastName avatar')
      .populate('vendor', 'firstName lastName');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if product is active (unless user is admin)
    if (product.status !== 'active' && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, [
  body('name').trim().isLength({ min: 1, max: 200 }).withMessage('Product name is required and must be less than 200 characters'),
  body('description').trim().isLength({ min: 1, max: 2000 }).withMessage('Description is required and must be less than 2000 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('inventory.stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if category exists
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if subcategory exists (if provided)
    if (req.body.subcategory) {
      const subcategory = await Category.findById(req.body.subcategory);
      if (!subcategory) {
        return res.status(400).json({
          success: false,
          message: 'Subcategory not found'
        });
      }
    }

    const product = new Product({
      ...req.body,
      vendor: req.user._id
    });

    await product.save();

    // Populate the response
    await product.populate('category', 'name slug');
    if (product.subcategory) {
      await product.populate('subcategory', 'name slug');
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, [
  body('name').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Product name must be less than 200 characters'),
  body('description').optional().trim().isLength({ min: 1, max: 2000 }).withMessage('Description must be less than 2000 characters'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').optional().isMongoId().withMessage('Valid category ID is required'),
  body('inventory.stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if category exists (if being updated)
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    // Check if subcategory exists (if being updated)
    if (req.body.subcategory) {
      const subcategory = await Category.findById(req.body.subcategory);
      if (!subcategory) {
        return res.status(400).json({
          success: false,
          message: 'Subcategory not found'
        });
      }
    }

    // Update product
    Object.assign(product, req.body);
    await product.save();

    // Populate the response
    await product.populate('category', 'name slug');
    if (product.subcategory) {
      await product.populate('subcategory', 'name slug');
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured/list', async (req, res, next) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      status: 'active',
      featured: true
    })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get products on sale
// @route   GET /api/products/sale
// @access  Public
router.get('/sale/list', async (req, res, next) => {
  try {
    const { limit = 12 } = req.query;

    const products = await Product.find({
      status: 'active',
      onSale: true,
      $or: [
        { saleEndDate: { $gte: new Date() } },
        { saleEndDate: { $exists: false } }
      ]
    })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
router.get('/:id/related', async (req, res, next) => {
  try {
    const { limit = 4 } = req.query;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      status: 'active',
      $or: [
        { category: product.category },
        { tags: { $in: product.tags } },
        { brand: product.brand }
      ]
    })
      .populate('category', 'name slug')
      .sort({ 'ratings.average': -1, createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: { products: relatedProducts }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;