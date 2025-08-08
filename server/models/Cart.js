const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  variant: {
    size: String,
    color: String,
    sku: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  appliedCoupon: {
    code: String,
    discount: Number,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed']
    }
  },
  estimatedTax: {
    type: Number,
    default: 0
  },
  estimatedShipping: {
    type: Number,
    default: 0
  },
  estimatedTotal: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
cartSchema.index({ user: 1 });
cartSchema.index({ 'items.product': 1 });

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
  this.calculateTotals();
  next();
});

// Method to calculate cart totals
cartSchema.methods.calculateTotals = function() {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Calculate estimated tax (8% - should be configurable)
  this.estimatedTax = Math.round(this.totalPrice * 0.08 * 100) / 100;
  
  // Calculate estimated shipping (free shipping over $50)
  this.estimatedShipping = this.totalPrice >= 50 ? 0 : 9.99;
  
  // Apply coupon discount if applicable
  let discount = 0;
  if (this.appliedCoupon) {
    if (this.appliedCoupon.discountType === 'percentage') {
      discount = Math.round(this.totalPrice * (this.appliedCoupon.discount / 100) * 100) / 100;
    } else {
      discount = this.appliedCoupon.discount;
    }
  }
  
  this.estimatedTotal = this.totalPrice + this.estimatedTax + this.estimatedShipping - discount;
  this.estimatedTotal = Math.max(0, this.estimatedTotal); // Ensure total is not negative
};

// Method to add item to cart
cartSchema.methods.addItem = function(productId, quantity = 1, variant = {}, price) {
  const existingItemIndex = this.items.findIndex(item => {
    return item.product.toString() === productId.toString() &&
           JSON.stringify(item.variant) === JSON.stringify(variant);
  });
  
  if (existingItemIndex > -1) {
    // Update existing item quantity
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].price = price; // Update price in case it changed
  } else {
    // Add new item
    this.items.push({
      product: productId,
      quantity,
      variant,
      price
    });
  }
  
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItem = function(itemId, quantity) {
  const item = this.items.id(itemId);
  if (item) {
    if (quantity <= 0) {
      this.items.pull(itemId);
    } else {
      item.quantity = quantity;
    }
  }
  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(itemId) {
  this.items.pull(itemId);
  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.appliedCoupon = undefined;
  return this.save();
};

// Method to apply coupon
cartSchema.methods.applyCoupon = function(couponCode, discount, discountType) {
  this.appliedCoupon = {
    code: couponCode,
    discount,
    discountType
  };
  return this.save();
};

// Method to remove coupon
cartSchema.methods.removeCoupon = function() {
  this.appliedCoupon = undefined;
  return this.save();
};

// Static method to find or create cart for user
cartSchema.statics.findOrCreateCart = async function(userId) {
  let cart = await this.findOne({ user: userId }).populate('items.product');
  
  if (!cart) {
    cart = new this({ user: userId });
    await cart.save();
  }
  
  return cart;
};

// Method to validate cart items (check if products still exist and are in stock)
cartSchema.methods.validateItems = async function() {
  const Product = mongoose.model('Product');
  const invalidItems = [];
  
  for (const item of this.items) {
    const product = await Product.findById(item.product);
    
    if (!product || product.status !== 'active') {
      invalidItems.push({
        itemId: item._id,
        reason: 'Product no longer available'
      });
    } else if (product.inventory.trackQuantity && product.inventory.stock < item.quantity) {
      invalidItems.push({
        itemId: item._id,
        reason: `Only ${product.inventory.stock} items in stock`,
        availableStock: product.inventory.stock
      });
    }
  }
  
  return invalidItems;
};

module.exports = mongoose.model('Cart', cartSchema);