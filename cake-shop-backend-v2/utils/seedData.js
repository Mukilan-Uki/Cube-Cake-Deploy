const Cake = require('../models/Cake');
const User = require('../models/User');
const Order = require('../models/Order');
const Shop = require('../models/Shop');
const bcrypt = require('bcryptjs');

const seedInitialData = async () => {
  try {
    // Check if we have cakes
    const cakeCount = await Cake.countDocuments();
    if (cakeCount === 0) {
      console.log('🌱 Seeding initial cake data with LKR prices...');
      
      const cakesData = [
        {
          name: "Chocolate Dream",
          description: "Rich dark chocolate cake with creamy chocolate ganache and chocolate shavings",
          priceLKR: 13797,
          category: "Birthday",
          image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
          isPopular: true,
          isAvailable: true
        },
        {
          name: "Vanilla Elegance",
          description: "Classic vanilla sponge with buttercream frosting and fresh berries",
          priceLKR: 11997,
          category: "Wedding",
          image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop",
          isPopular: true,
          isAvailable: true
        },
        {
          name: "Strawberry Bliss",
          description: "Fresh strawberry cake with cream cheese frosting and strawberry topping",
          priceLKR: 12897,
          category: "Anniversary",
          image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop",
          isPopular: true,
          isAvailable: true
        },
        {
          name: "Red Velvet Royal",
          description: "Classic red velvet with cream cheese frosting and edible gold leaf",
          priceLKR: 14997,
          category: "Special",
          image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=300&fit=crop",
          isPopular: true,
          isAvailable: true
        }
      ];
      
      await Cake.insertMany(cakesData);
      console.log('✅ Cakes seeded with LKR prices');
    }
    
    // Check if we have super admin user
    const superAdminCount = await User.countDocuments({ email: 'admin@cubecake.com' });
    if (superAdminCount === 0) {
      console.log('👑 Creating super admin user...');
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        name: 'Super Admin',
        email: 'admin@cubecake.com',
        phone: '0743086099',
        password: hashedPassword,
        role: 'super_admin'
      });
      console.log('✅ Super admin created (admin@cubecake.com / admin123)');
    }

    // Check if we have a test shop owner
    const shopOwnerCount = await User.countDocuments({ email: 'shop@example.com' });
    if (shopOwnerCount === 0) {
      console.log('🏪 Creating test shop owner...');
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('shop123', salt);
      
      const shopOwner = await User.create({
        name: 'Test Shop',
        email: 'shop@example.com',
        phone: '0771234567',
        password: hashedPassword,
        role: 'shop_owner'
      });

      // Create a shop for them
      const shop = await Shop.create({
        shopName: 'Test Bakery',
        shopSlug: 'test-bakery',
        owner: shopOwner._id,
        admins: [shopOwner._id],
        email: 'shop@example.com',
        phone: '0771234567',
        address: {
          street: '123 Main Street',
          city: 'Colombo',
          country: 'Sri Lanka'
        },
        businessType: 'bakery',
        isVerified: true
      });

      // Update shop owner with shopId
      shopOwner.shopId = shop._id;
      shopOwner.shops = [shop._id];
      await shopOwner.save();

      console.log('✅ Test shop owner created (shop@example.com / shop123)');
    }
    
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = { seedInitialData };