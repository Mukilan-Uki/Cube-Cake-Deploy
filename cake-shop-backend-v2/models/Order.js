const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Changed from false to true
  },
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
  deliveryType: { type: String, enum: ['pickup', 'delivery'], default: 'pickup' },
  deliveryAddress: String,
  specialInstructions: String,
  paymentMethod: { type: String, enum: ['cash', 'card', 'online'], default: 'cash' },
  
  // Cake design details
  base: String,
  frosting: String,
  size: String,
  layers: Number,
  toppings: [String],
  message: String,
  colors: {
    cake: String,
    frosting: String,
    decorations: String
  },
  
  totalPrice: Number,
  currency: { 
    type: String, 
    default: 'LKR',
    enum: ['LKR']
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

orderSchema.index({ orderId: 1 }, { unique: true });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ user: 1 }); // Add index for user queries

orderSchema.virtual('isActive').get(function() {
  return ['Pending', 'Preparing', 'Ready'].includes(this.status);
});

module.exports = mongoose.model('Order', orderSchema);