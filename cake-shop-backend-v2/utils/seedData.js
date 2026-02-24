const Cake = require('../models/Cake');
const User = require('../models/User');
const Order = require('../models/Order');
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
      
      await Cake.insertMany(cakesData);
      console.log('✅ Cakes seeded with LKR prices');
    }
    
    // Check if we have admin user
    const adminCount = await User.countDocuments({ email: 'admin@cubecake.com' });
    if (adminCount === 0) {
      console.log('👑 Creating admin user...');
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        name: 'Admin User',
        email: 'admin@cubecake.com',
        phone: '0743086099',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created (admin@cubecake.com / admin123)');
    }
    
    // Check if we have sample orders with LKR
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      console.log('📦 Seeding sample orders with LKR prices...');
      
      // Get admin user ID for orders
      const adminUser = await User.findOne({ email: 'admin@cubecake.com' });
      
      // Create a test customer if needed
      let testCustomer = await User.findOne({ email: 'john.doe@example.com' });
      if (!testCustomer) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('customer123', salt);
        
        testCustomer = await User.create({
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '0771234567',
          password: hashedPassword,
          role: 'customer'
        });
      }
      
      const sampleOrders = [
        {
          user: testCustomer._id,
          orderId: `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          customerName: 'John Doe',
          phone: '0771234567',
          email: 'john.doe@example.com',
          deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          deliveryType: 'delivery',
          deliveryAddress: '123 Main Street, Colombo 03',
          base: 'chocolate',
          frosting: 'vanilla',
          size: 'medium',
          layers: 2,
          toppings: ['sprinkles', 'chocolate-chips'],
          message: 'Happy Birthday!',
          totalPrice: 16995,
          status: 'Pending',
          currency: 'LKR'
        },
        {
          user: adminUser._id,
          orderId: `ORDER-${Date.now() + 1}-${Math.floor(Math.random() * 1000)}`,
          customerName: 'Jane Smith',
          phone: '0787654321',
          email: 'jane.smith@example.com',
          deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          deliveryType: 'pickup',
          base: 'red-velvet',
          frosting: 'cream-cheese',
          size: 'large',
          layers: 3,
          toppings: ['berries', 'gold-leaf'],
          message: 'Happy Anniversary!',
          totalPrice: 23499,
          status: 'Preparing',
          currency: 'LKR'
        }
      ];
      
      await Order.insertMany(sampleOrders);
      console.log('✅ Sample orders seeded with LKR prices');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = { seedInitialData };