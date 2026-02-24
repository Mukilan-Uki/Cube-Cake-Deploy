const express = require('express');
const router = express.Router();
const {
  registerShop,
  getShopDashboard,
  getShopOrders,
  updateOrderStatus,
  getShopSettings,
  updateShopSettings,
  getShopCakes,
  addShopCake,
  updateShopCake,
  deleteShopCake
} = require('../controllers/shopController');
const { protect, shopOwner } = require('../middleware/auth');

// All shop routes require authentication and shop owner role
router.use(protect, shopOwner);

// Shop registration
router.post('/register', registerShop);

// Dashboard
router.get('/dashboard', getShopDashboard);

// Orders
router.get('/orders', getShopOrders);
router.put('/orders/:orderId/status', updateOrderStatus);

// Settings
router.get('/settings', getShopSettings);
router.put('/settings', updateShopSettings);

// Cakes
router.get('/cakes', getShopCakes);
router.post('/cakes', addShopCake);
router.put('/cakes/:cakeId', updateShopCake);
router.delete('/cakes/:cakeId', deleteShopCake);

module.exports = router;