const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const orderRoutes = require('./orderRoutes');
const cakeRoutes = require('./cakeRoutes');
const statsRoutes = require('./statsRoutes');

// Register routes
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/cakes', cakeRoutes);
router.use('/stats', statsRoutes);

// API documentation route
router.get('/docs', (req, res) => {
  res.json({
    message: 'Cube Cake API Documentation',
    version: '1.0.0',
    currency: 'Sri Lankan Rupee (LKR)',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        adminLogin: 'POST /api/auth/admin/login',
        shopRegister: 'POST /api/auth/register-shop',
        profile: 'GET /api/auth/me',
        updateProfile: 'PUT /api/auth/profile',
        changePassword: 'PUT /api/auth/change-password'
      },
      orders: {
        create: 'POST /api/orders',
        getAll: 'GET /api/orders',
        myOrders: 'GET /api/orders/my-orders',
        getSingle: 'GET /api/orders/:orderId',
        updateStatus: 'PATCH /api/orders/:orderId/status',
        cancel: 'PUT /api/orders/:orderId/cancel'
      },
      cakes: {
        getAll: 'GET /api/cakes',
        getById: 'GET /api/cakes/:id',
        byCategory: 'GET /api/cakes/category/:category',
        search: 'GET /api/cakes/search/:query',
        popular: 'GET /api/cakes/popular',
        new: 'GET /api/cakes/new'
      },
      stats: {
        getStats: 'GET /api/stats',
        monthly: 'GET /api/stats/monthly',
        popularCakes: 'GET /api/stats/popular-cakes'
      }
    }
  });
});

module.exports = router;