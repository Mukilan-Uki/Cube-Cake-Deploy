const express = require('express');
const router = express.Router();
const {
  getStats,
  getMonthlyStats,
  getPopularCakesStats
} = require('../controllers/statsController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

// All stats routes are admin only
router.use(protect, admin);

router.get('/', getStats);
router.get('/monthly', getMonthlyStats);
router.get('/popular-cakes', getPopularCakesStats);

module.exports = router;