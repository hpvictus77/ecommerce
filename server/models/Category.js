const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Category name cannot be more than 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  image: {
    type: String,
    default: ''
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 0
  },
  path: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  attributes: [{
    name: String,
    type: {
      type: String,
      enum: ['text', 'number', 'select', 'multiselect', 'boolean'],
      default: 'text'
    },
    options: [String],
    required: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
categorySchema.index({ parent: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });

// Virtual for children categories
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for product count
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Pre-save middleware to generate slug and set path
categorySchema.pre('save', async function(next) {
  if (this.isModified('name') || this.isNew) {
    // Generate slug from name
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  if (this.isModified('parent') || this.isNew) {
    // Set level and path based on parent
    if (this.parent) {
      const parent = await this.constructor.findById(this.parent);
      if (parent) {
        this.level = parent.level + 1;
        this.path = parent.path ? `${parent.path}/${parent._id}` : `${parent._id}`;
      }
    } else {
      this.level = 0;
      this.path = '';
    }
  }
  
  next();
});

// Static method to get category tree
categorySchema.statics.getCategoryTree = async function() {
  const categories = await this.find({ isActive: true })
    .sort({ level: 1, sortOrder: 1, name: 1 })
    .lean();
  
  const categoryMap = {};
  const tree = [];
  
  // First pass: create map
  categories.forEach(category => {
    categoryMap[category._id] = { ...category, children: [] };
  });
  
  // Second pass: build tree
  categories.forEach(category => {
    if (category.parent) {
      if (categoryMap[category.parent]) {
        categoryMap[category.parent].children.push(categoryMap[category._id]);
      }
    } else {
      tree.push(categoryMap[category._id]);
    }
  });
  
  return tree;
};

// Static method to get all subcategories
categorySchema.statics.getSubcategories = async function(categoryId) {
  const category = await this.findById(categoryId);
  if (!category) return [];
  
  const subcategories = await this.find({
    path: new RegExp(`(^|/)${categoryId}(/|$)`)
  });
  
  return subcategories;
};

module.exports = mongoose.model('Category', categorySchema);