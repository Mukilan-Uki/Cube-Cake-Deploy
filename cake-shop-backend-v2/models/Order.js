const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
    index: true
  },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, required: true },
  
  deliveryDate: { type: Date, required: true },
  deliveryType: { 
    type: String, 
    enum: ['pickup', 'delivery'], 
    default: 'pickup' 
  },
  deliveryAddress: {
    street: String,
    city: String,
    zipCode: String,
    instructions: String
  },
  
  cakeDetails: {
    base: String,
    frosting: String,
    size: String,
    layers: { type: Number, default: 2 },
    toppings: [String],
    message: String,
    colors: {
      cake: { type: String, default: '#8B4513' },
      frosting: { type: String, default: '#FFF5E6' },
      decorations: { type: String, default: '#FF6B8B' }
    },
    specialInstructions: String
  },
  
  priceBreakdown: {
    basePrice: { type: Number, default: 0 },
    baseFlavorPrice: { type: Number, default: 0 },
    frostingPrice: { type: Number, default: 0 },
    toppingsPrice: { type: Number, default: 0 },
    layersPrice: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 }
  },
  totalPrice: { type: Number, required: true },
  currency: { 
    type: String, 
    default: 'LKR'
  },
  
  status: { 
    type: String, 
    enum: [
      'pending', 'confirmed', 'preparing', 'ready', 
      'out_for_delivery', 'delivered', 'completed', 
      'cancelled', 'rejected'
    ], 
    default: 'pending' 
  },
  
  statusHistory: [{
    status: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String,
    timestamp: { type: Date, default: Date.now }
  }],
  
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'online'], 
    default: 'cash' 
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: String,
  paidAt: Date,
  
  estimatedReadyTime: Date,
  actualReadyTime: Date,
  confirmedAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  
  deliveryPerson: String,
  deliveryPersonPhone: String,
  
  shopNotes: String,
  customerNotes: String,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

orderSchema.index({ shop: 1, createdAt: -1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderId: 1 }, { unique: true });

orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);