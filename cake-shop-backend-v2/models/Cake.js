const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  name: { 
    type: String, 
    required: true 
  },
  description: String,
  priceLKR: { 
    type: Number, 
    required: true 
  },
  category: String,
  image: String,
  images: [String],
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  flavors: [String],
  sizes: [String],
  isPopular: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  currency: { 
    type: String, 
    default: 'LKR'
  },
  preparationTime: Number,
  ingredients: [String],
  allergens: [String],
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