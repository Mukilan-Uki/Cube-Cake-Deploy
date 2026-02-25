const express = require('express');
const router = express.Router();
const {
  registerShop,
  getShopDashboard,
  getShopOrders,
  updateOrderStatus,
  getShopSettings,
  updateShopSettings
  // Removed: getShopCakes, addShopCake, updateShopCake, deleteShopCake
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

// Note: Cake routes are now handled in shopCakeRoutes.js
// GET /api/shops/cakes -> moved to shopCakeRoutes.js
// POST /api/shops/cakes -> moved to shopCakeRoutes.js
// PUT /api/shops/cakes/:cakeId -> moved to shopCakeRoutes.js
// DELETE /api/shops/cakes/:cakeId -> moved to shopCakeRoutes.js

module.exports = router;