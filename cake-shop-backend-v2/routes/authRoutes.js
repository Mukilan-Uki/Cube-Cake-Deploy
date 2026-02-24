const express = require('express');
const router = express.Router();
const {
  register,
  login,
  adminLogin,
  registerShopOwner,
  registerShop,
  getProfile,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);

// Shop registration routes (BOTH endpoints work)
router.post('/register-shop-owner', registerShopOwner);
router.post('/register-shop', registerShop); // This matches your frontend

// Protected routes
router.get('/me', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes are working!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;