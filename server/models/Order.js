const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  variant: {
    size: String,
    color: String,
    sku: String
  }
});

const shippingAddressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  billingAddress: shippingAddressSchema,
  paymentMethod: {
    type: {
      type: String,
      enum: ['card', 'paypal', 'apple_pay', 'google_pay'],
      required: true
    },
    last4: String,
    brand: String
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    shipping: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    discount: {
      type: Number,
      min: 0,
      default: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  status: {
    type: String,
    enum: [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
      'failed'
    ],
    default: 'pending'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: Date,
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: Date,
  shippingDetails: {
    carrier: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    shippedAt: Date
  },
  notes: String,
  cancellationReason: String,
  refundAmount: {
    type: Number,
    min: 0
  },
  refundReason: String,
  refundedAt: Date,
  couponCode: String,
  currency: {
    type: String,
    default: 'USD'
  },
  statusHistory: [{
    status: String,
    date: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// Index for better query performance
orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'paymentResult.id': 1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Virtual for order total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order weight
orderSchema.virtual('totalWeight').get(function() {
  return this.items.reduce((total, item) => {
    const itemWeight = item.product?.weight || 0;
    return total + (itemWeight * item.quantity);
  }, 0);
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
  this.status = newStatus;
  
  // Add to status history
  this.statusHistory.push({
    status: newStatus,
    note,
    updatedBy
  });
  
  // Update specific fields based on status
  switch (newStatus) {
    case 'shipped':
      this.shippingDetails.shippedAt = new Date();
      break;
    case 'delivered':
      this.isDelivered = true;
      this.deliveredAt = new Date();
      break;
    case 'cancelled':
    case 'refunded':
      // Handle cancellation/refund logic here
      break;
  }
  
  return this.save();
};

// Method to calculate totals
orderSchema.methods.calculateTotals = function() {
  this.pricing.subtotal = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  // Calculate tax (assuming 8% tax rate, this should be configurable)
  this.pricing.tax = Math.round(this.pricing.subtotal * 0.08 * 100) / 100;
  
  // Calculate total
  this.pricing.total = this.pricing.subtotal + this.pricing.tax + this.pricing.shipping - this.pricing.discount;
  
  return this;
};

// Static method to get order analytics
orderSchema.statics.getAnalytics = async function(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        },
        status: { $nin: ['cancelled', 'failed'] }
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.total' },
        averageOrderValue: { $avg: '$pricing.total' }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 };
};

module.exports = mongoose.model('Order', orderSchema);