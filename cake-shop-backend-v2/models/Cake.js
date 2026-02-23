const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  priceLKR: { type: Number, required: true }, // Changed from price to priceLKR
  category: String,
  image: String,
  rating: Number,
  flavors: [String],
  sizes: [String],
  isPopular: Boolean,
  isNew: Boolean,
  currency: { 
    type: String, 
    default: 'LKR',
    enum: ['LKR']
  }
});

module.exports = mongoose.model('Cake', cakeSchema);