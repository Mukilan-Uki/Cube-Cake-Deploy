const express = require('express');
const router = express.Router();
const {
  getAllCakes,
  getCakesByShop,
  getCakeById,
  getFeaturedCakes
} = require('../controllers/publicCakeController');

// All routes are public
router.get('/cakes', getAllCakes);
router.get('/cakes/featured', getFeaturedCakes);
router.get('/cakes/:id', getCakeById);
router.get('/shops/:shopId/cakes', getCakesByShop);

module.exports = router;