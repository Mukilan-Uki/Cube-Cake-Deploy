const express = require('express');
const router = express.Router();
const {
  getAllCakes,
  getCakeById,
  createCake,
  updateCake,
  deleteCake,
  getCakesByCategory,
  searchCakes,
  getPopularCakes,
  getNewCakes,
  seedCakes
} = require('../controllers/cakeController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public routes
router.get('/', getAllCakes);
router.get('/popular', getPopularCakes);
router.get('/new', getNewCakes);
router.get('/category/:category', getCakesByCategory);
router.get('/search/:query', searchCakes);
router.get('/:id', getCakeById);

// Admin only routes
router.post('/', protect, admin, createCake);
router.put('/:id', protect, admin, updateCake);
router.delete('/:id', protect, admin, deleteCake);
router.post('/seed', protect, admin, seedCakes);

module.exports = router;