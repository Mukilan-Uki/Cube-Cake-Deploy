const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  shopName: {
    type: String,
    required: true
  },
  shopSlug: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Cake name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  priceLKR: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Birthday', 'Wedding', 'Anniversary', 'Special', 'Custom', 'Kids']
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

cakeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Cake', cakeSchema);