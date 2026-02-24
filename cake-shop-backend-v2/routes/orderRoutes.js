const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  trackOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// Public route for tracking
router.get('/track/:orderId', trackOrder);

// Protected routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:orderId', protect, getOrderById);
router.put('/:orderId/cancel', protect, cancelOrder);

module.exports = router;