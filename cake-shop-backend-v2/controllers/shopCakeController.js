const Cake = require('../models/Cake');
const Shop = require('../models/Shop');

// @desc    Get all cakes for logged in shop owner
// @route   GET /api/shops/my-cakes
// @access  Private (Shop Owner only)
const getMyCakes = async (req, res) => {
  try {
    const shopId = req.user.shopId;
    
    const cakes = await Cake.find({ shop: shopId }).sort({ createdAt: -1 });
    
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

// @desc    Add new cake
// @route   POST /api/shops/cakes
// @access  Private (Shop Owner only)
const addCake = async (req, res) => {
  try {
    const shopId = req.user.shopId;
    
    // Get shop details
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const cakeData = {
      ...req.body,
      shop: shopId,
      shopName: shop.shopName,
      shopSlug: shop.shopSlug
    };

    const cake = await Cake.create(cakeData);

    res.status(201).json({
      success: true,
      message: 'Cake added successfully',
      cake
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding cake',
      error: error.message
    });
  }
};

// @desc    Update cake
// @route   PUT /api/shops/cakes/:id
// @access  Private (Shop Owner only)
const updateCake = async (req, res) => {
  try {
    const { id } = req.params;
    const shopId = req.user.shopId;

    const cake = await Cake.findOneAndUpdate(
      { _id: id, shop: shopId },
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!cake) {
      return res.status(404).json({
        success: false,
        message: 'Cake not found or you do not have permission'
      });
    }

    res.json({
      success: true,
      message: 'Cake updated successfully',
      cake
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating cake',
      error: error.message
    });
  }
};

// @desc    Delete cake
// @route   DELETE /api/shops/cakes/:id
// @access  Private (Shop Owner only)
const deleteCake = async (req, res) => {
  try {
    const { id } = req.params;
    const shopId = req.user.shopId;

    const cake = await Cake.findOneAndDelete({ _id: id, shop: shopId });

    if (!cake) {
      return res.status(404).json({
        success: false,
        message: 'Cake not found or you do not have permission'
      });
    }

    res.json({
      success: true,
      message: 'Cake deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting cake',
      error: error.message
    });
  }
};

// @desc    Toggle cake availability
// @route   PATCH /api/shops/cakes/:id/toggle
// @access  Private (Shop Owner only)
const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const shopId = req.user.shopId;

    const cake = await Cake.findOne({ _id: id, shop: shopId });

    if (!cake) {
      return res.status(404).json({
        success: false,
        message: 'Cake not found'
      });
    }

    cake.isAvailable = !cake.isAvailable;
    cake.updatedAt = Date.now();
    await cake.save();

    res.json({
      success: true,
      message: `Cake is now ${cake.isAvailable ? 'available' : 'unavailable'}`,
      cake
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling availability',
      error: error.message
    });
  }
};

// @desc    Toggle popular status
// @route   PATCH /api/shops/cakes/:id/popular
// @access  Private (Shop Owner only)
const togglePopular = async (req, res) => {
  try {
    const { id } = req.params;
    const shopId = req.user.shopId;

    const cake = await Cake.findOne({ _id: id, shop: shopId });

    if (!cake) {
      return res.status(404).json({
        success: false,
        message: 'Cake not found'
      });
    }

    cake.isPopular = !cake.isPopular;
    cake.updatedAt = Date.now();
    await cake.save();

    res.json({
      success: true,
      message: `Cake ${cake.isPopular ? 'marked as popular' : 'removed from popular'}`,
      cake
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling popular status',
      error: error.message
    });
  }
};

module.exports = {
  getMyCakes,
  addCake,
  updateCake,
  deleteCake,
  toggleAvailability,
  togglePopular
};