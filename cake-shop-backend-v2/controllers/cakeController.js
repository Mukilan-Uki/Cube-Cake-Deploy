const Cake = require('../models/Cake');

// @desc    Get all cakes
// @route   GET /api/cakes
// @access  Public
const getAllCakes = async (req, res, next) => {
  try {
    const cakes = await Cake.find();
    
    res.json({
      success: true,
      count: cakes.length,
      cakes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cake by ID
// @route   GET /api/cakes/:id
// @access  Public
const getCakeById = async (req, res, next) => {
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
    next(error);
  }
};

// @desc    Create new cake (admin only)
// @route   POST /api/cakes
// @access  Private/Admin
const createCake = async (req, res, next) => {
  try {
    const cakeData = {
      ...req.body,
      currency: 'LKR'
    };

    const cake = await Cake.create(cakeData);

    res.status(201).json({
      success: true,
      message: 'Cake created successfully',
      cake
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cake (admin only)
// @route   PUT /api/cakes/:id
// @access  Private/Admin
const updateCake = async (req, res, next) => {
  try {
    const cake = await Cake.findByIdAndUpdate(
      req.params.id,
      { ...req.body, currency: 'LKR', updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!cake) {
      return res.status(404).json({
        success: false,
        message: 'Cake not found'
      });
    }

    res.json({
      success: true,
      message: 'Cake updated successfully',
      cake
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete cake (admin only)
// @route   DELETE /api/cakes/:id
// @access  Private/Admin
const deleteCake = async (req, res, next) => {
  try {
    const cake = await Cake.findByIdAndDelete(req.params.id);

    if (!cake) {
      return res.status(404).json({
        success: false,
        message: 'Cake not found'
      });
    }

    res.json({
      success: true,
      message: 'Cake deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cakes by category
// @route   GET /api/cakes/category/:category
// @access  Public
const getCakesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const cakes = await Cake.find({ category });

    res.json({
      success: true,
      count: cakes.length,
      cakes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search cakes
// @route   GET /api/cakes/search/:query
// @access  Public
const searchCakes = async (req, res, next) => {
  try {
    const { query } = req.params;

    const cakes = await Cake.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    });

    res.json({
      success: true,
      count: cakes.length,
      cakes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular cakes
// @route   GET /api/cakes/popular
// @access  Public
const getPopularCakes = async (req, res, next) => {
  try {
    const cakes = await Cake.find({ isPopular: true }).limit(6);

    res.json({
      success: true,
      count: cakes.length,
      cakes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get new cakes
// @route   GET /api/cakes/new
// @access  Public
const getNewCakes = async (req, res, next) => {
  try {
    const cakes = await Cake.find({ isNew: true }).limit(4);

    res.json({
      success: true,
      count: cakes.length,
      cakes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed cakes data (admin only)
// @route   POST /api/cakes/seed
// @access  Private/Admin
const seedCakes = async (req, res, next) => {
  try {
    const cakesData = [
      {
        name: "Chocolate Dream",
        description: "Rich dark chocolate cake with creamy chocolate ganache and chocolate shavings",
        priceLKR: 13797,
        category: "Birthday",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
        rating: 4.8,
        flavors: ["Chocolate", "Dark Chocolate"],
        sizes: ["Small", "Medium", "Large"],
        isPopular: true,
        isNew: false,
        currency: "LKR"
      },
      {
        name: "Vanilla Elegance",
        description: "Classic vanilla sponge with buttercream frosting and fresh berries",
        priceLKR: 11997,
        category: "Wedding",
        image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop",
        rating: 4.6,
        flavors: ["Vanilla", "Buttercream"],
        sizes: ["Medium", "Large"],
        isPopular: true,
        isNew: false,
        currency: "LKR"
      },
      {
        name: "Strawberry Bliss",
        description: "Fresh strawberry cake with cream cheese frosting and strawberry topping",
        priceLKR: 12897,
        category: "Anniversary",
        image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop",
        rating: 4.9,
        flavors: ["Strawberry", "Cream Cheese"],
        sizes: ["Small", "Medium", "Large"],
        isPopular: true,
        isNew: true,
        currency: "LKR"
      },
      {
        name: "Red Velvet Royal",
        description: "Classic red velvet with cream cheese frosting and edible gold leaf",
        priceLKR: 14997,
        category: "Special",
        image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=300&fit=crop",
        rating: 4.9,
        flavors: ["Red Velvet", "Cream Cheese"],
        sizes: ["Medium", "Large"],
        isPopular: true,
        isNew: false,
        currency: "LKR"
      }
    ];

    // Clear existing cakes
    await Cake.deleteMany({});

    // Insert new cakes
    const cakes = await Cake.insertMany(cakesData);

    res.json({
      success: true,
      message: 'Cakes seeded successfully',
      count: cakes.length,
      cakes
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};