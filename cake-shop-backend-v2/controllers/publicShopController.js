const Shop = require('../models/Shop');

// @desc    Get all active shops
// @route   GET /api/public/shops
// @access  Public
const getAllShops = async (req, res, next) => {
  try {
    const { city, limit = 20, page = 1 } = req.query;

    const query = { 
      isActive: true, 
      isVerified: true 
    };

    if (city) {
      query['address.city'] = city;
    }

    const skip = (page - 1) * limit;

    const [shops, total] = await Promise.all([
      Shop.find(query)
        .select('-admins -settings -holidays -stats')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Shop.countDocuments(query)
    ]);

    res.json({
      success: true,
      shops,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get shop by slug
// @route   GET /api/public/shops/:slug
// @access  Public
const getShopBySlug = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ 
      shopSlug: req.params.slug,
      isActive: true 
    }).select('-admins -settings');

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    res.json({
      success: true,
      shop
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllShops,
  getShopBySlug
};