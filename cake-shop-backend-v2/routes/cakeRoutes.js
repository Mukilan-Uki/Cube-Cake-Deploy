const express = require('express');
const router = express.Router();
const Cake = require('../models/Cake');

// Get all cakes (with LKR prices)
router.get('/cakes', async (req, res) => {
  try {
    const cakes = await Cake.find();
    res.json({
      success: true,
      count: cakes.length,
      cakes: cakes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cakes',
      error: error.message
    });
  }
});

// Get cake by ID
router.get('/cakes/:id', async (req, res) => {
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
      cake: cake
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cake',
      error: error.message
    });
  }
});

// Create new cake (admin only) - Now with LKR
router.post('/cakes', async (req, res) => {
  try {
    const cakeData = {
      ...req.body,
      currency: 'LKR'
    };
    
    const cake = new Cake(cakeData);
    await cake.save();
    
    res.status(201).json({
      success: true,
      message: 'Cake created successfully with LKR pricing',
      cake: cake
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating cake',
      error: error.message
    });
  }
});

// Update cake (admin only)
router.put('/cakes/:id', async (req, res) => {
  try {
    const cake = await Cake.findByIdAndUpdate(
      req.params.id,
      { ...req.body, currency: 'LKR' },
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
      cake: cake
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating cake',
      error: error.message
    });
  }
});

// Delete cake (admin only)
router.delete('/cakes/:id', async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: 'Error deleting cake',
      error: error.message
    });
  }
});

// Seed cakes data with LKR prices
router.post('/cakes/seed', async (req, res) => {
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
      },
      {
        name: "Lemon Zest",
        description: "Tangy lemon cake with lemon buttercream and candied lemon peel",
        priceLKR: 11697,
        category: "Spring",
        image: "https://images.unsplash.com/photo-1559629819-638a8f0a430b?w=400&h=300&fit=crop",
        rating: 4.7,
        flavors: ["Lemon", "Vanilla"],
        sizes: ["Small", "Medium"],
        isPopular: false,
        isNew: true,
        currency: "LKR"
      },
      {
        name: "Carrot Walnut",
        description: "Moist carrot cake with walnuts and cream cheese frosting",
        priceLKR: 13497,
        category: "Birthday",
        image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=400&h=300&fit=crop",
        rating: 4.8,
        flavors: ["Carrot", "Walnut", "Cinnamon"],
        sizes: ["Medium", "Large"],
        isPopular: true,
        isNew: false,
        currency: "LKR"
      }
    ];
    
    // Clear existing cakes
    await Cake.deleteMany({});
    
    // Insert new cakes with LKR prices
    const cakes = await Cake.insertMany(cakesData);
    
    res.json({
      success: true,
      message: 'Cakes seeded successfully with LKR prices',
      count: cakes.length,
      cakes: cakes
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error seeding cakes',
      error: error.message
    });
  }
});

// Get cakes by category
router.get('/cakes/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const cakes = await Cake.find({ category: category });
    
    res.json({
      success: true,
      count: cakes.length,
      cakes: cakes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cakes by category',
      error: error.message
    });
  }
});

// Search cakes
router.get('/cakes/search/:query', async (req, res) => {
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
      cakes: cakes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching cakes',
      error: error.message
    });
  }
});

// Get popular cakes
router.get('/cakes/popular', async (req, res) => {
  try {
    const cakes = await Cake.find({ isPopular: true }).limit(6);
    
    res.json({
      success: true,
      count: cakes.length,
      cakes: cakes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching popular cakes',
      error: error.message
    });
  }
});

// Get new cakes
router.get('/cakes/new', async (req, res) => {
  try {
    const cakes = await Cake.find({ isNew: true }).limit(4);
    
    res.json({
      success: true,
      count: cakes.length,
      cakes: cakes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching new cakes',
      error: error.message
    });
  }
});

module.exports = router;