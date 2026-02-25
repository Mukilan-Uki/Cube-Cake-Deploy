const Cake = require('../models/Cake');

// @desc    Get all cakes for public display
// @route   GET /api/public/cakes
// @access  Public
const getAllCakes = async (req, res) => {
  try {
    const { category, shop, limit = 20, page = 1 } = req.query;

    const query = { isAvailable: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (shop) {
      query.shop = shop;
    }

    const skip = (page - 1) * limit;

    const [cakes, total] = await Promise.all([
      Cake.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Cake.countDocuments(query)
    ]);

    res.json({
      success: true,
      count: cakes.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      cakes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cakes',
      error: error.message
    });
  }
};

// @desc    Get cakes by shop
// @route   GET /api/public/shops/:shopId/cakes
// @access  Public
const getCakesByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    
    const cakes = await Cake.find({ 
      shop: shopId,
      isAvailable: true 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: cakes.length,
      cakes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cakes',
      error: error.message
    });
  }
};

// @desc    Get single cake by ID
// @route   GET /api/public/cakes/:id
// @access  Public
const getCakeById = async (req, res) => {
  try {
    const cake = await Cake.findById(req.params.id);

    if (!cake) {
      return res.status(404).json({
        success: false,
        message: 'Cake not found'
      });
    }

    res.json({
      success: true,
      cake
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cake',
      error: error.message
    });
  }
};

// @desc    Get featured/popular cakes for home page
// @route   GET /api/public/cakes/featured
// @access  Public
const getFeaturedCakes = async (req, res) => {
  try {
    const cakes = await Cake.find({ 
      isAvailable: true,
      isPopular: true 
    })
    .limit(6)
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: cakes.length,
      cakes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured cakes',
      error: error.message
    });
  }
};

module.exports = {
  getAllCakes,
  getCakesByShop,
  getCakeById,
  getFeaturedCakes
};