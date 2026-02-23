const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Database connection
async function connectDB() {
  try {
    // Use local MongoDB instead of in-memory
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cake-shop';
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📁 Database: ${MONGODB_URI}`);
    console.log(`💰 Currency: Sri Lankan Rupee (LKR)`);
    
    // Seed initial data (only if database is empty)
    await seedInitialData();
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('💡 Make sure MongoDB is installed and running');
    console.log('📝 To install MongoDB: https://docs.mongodb.com/manual/installation/');
    process.exit(1);
  }
}

// Seed initial data function with LKR prices
async function seedInitialData() {
  const Cake = require('./models/Cake');
  const User = require('./models/User');
  const Order = require('./models/Order');
  const bcrypt = require('bcryptjs');
  
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
}

// Import routes
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cakeRoutes = require('./routes/cakeRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api', orderRoutes);
app.use('/api', cakeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    currency: 'LKR',
    message: 'All prices are in Sri Lankan Rupees (LKR)'
  });
});

// API documentation
app.get('/api-docs', (req, res) => {
  res.json({
    message: 'Cube Cake API Documentation',
    version: '1.0.0',
    currency: 'Sri Lankan Rupee (LKR)',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        adminLogin: 'POST /api/auth/admin/login',
        shopRegister: 'POST /api/auth/register-shop'
      },
      orders: {
        getAll: 'GET /api/orders',
        create: 'POST /api/orders',
        myOrders: 'GET /api/orders/my-orders',
        getSingle: 'GET /api/orders/:orderId',
        updateStatus: 'PATCH /api/orders/:orderId/status'
      },
      cakes: {
        getAll: 'GET /api/cakes',
        getById: 'GET /api/cakes/:id',
        create: 'POST /api/cakes',
        update: 'PUT /api/cakes/:id',
        delete: 'DELETE /api/cakes/:id',
        byCategory: 'GET /api/cakes/category/:category',
        search: 'GET /api/cakes/search/:query',
        popular: 'GET /api/cakes/popular',
        new: 'GET /api/cakes/new',
        seed: 'POST /api/cakes/seed'
      },
      stats: {
        getStats: 'GET /api/stats'
      }
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cube Cake Backend - LKR</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          text-align: center;
          padding: 50px;
          background: linear-gradient(135deg, #FF9E6D, #FF6B8B);
          color: white;
        }
        .container {
          background: rgba(255, 255, 255, 0.95);
          color: #333;
          padding: 40px;
          border-radius: 20px;
          max-width: 900px;
          margin: 0 auto;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        h1 {
          color: #4A2C2A;
          font-family: 'Playfair Display', serif;
        }
        .badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 14px;
          margin: 5px;
        }
        .badge-lkr {
          background: linear-gradient(135deg, #FF9E6D, #FF6B8B);
          color: white;
        }
        .btn {
          display: inline-block;
          background: linear-gradient(135deg, #FF9E6D, #FF6B8B);
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 50px;
          margin: 10px;
          font-weight: bold;
          border: none;
          cursor: pointer;
          transition: transform 0.3s;
        }
        .btn:hover {
          transform: translateY(-3px);
        }
        .stats {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin: 30px 0;
        }
        .stat-item {
          text-align: center;
        }
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #FF6B8B;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎂 Cube Cake Studio</h1>
        <div style="margin: 20px 0;">
          <span class="badge badge-lkr">🇱🇰 Sri Lankan Rupees (LKR)</span>
        </div>
        
        <p style="font-size: 20px; margin: 30px 0;">
          Server is running on port ${PORT}
        </p>
        
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">✅</div>
            <div>Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">₨ LKR</div>
            <div>Currency Format</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">🗄️</div>
            <div>Persistent MongoDB</div>
          </div>
        </div>
        
        <div style="margin: 30px 0;">
          <a href="/health" class="btn">Health Check</a>
          <a href="/api-docs" class="btn">API Docs</a>
          <a href="/api/cakes" class="btn">View Cakes (LKR)</a>
          <a href="/api/stats" class="btn">View Stats</a>
        </div>
        
        <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee;">
          <h3 style="color: #4A2C2A;">Quick Access</h3>
          <p style="color: #666;">
            Admin Login: <strong>admin@cubecake.com</strong> / <strong>admin123</strong><br>
            MongoDB Compass: <strong>mongodb://localhost:27017/cake-shop</strong><br>
            Frontend: <a href="http://localhost:3000" style="color: #FF6B8B;">http://localhost:3000</a>
          </p>
          <p style="color: #999; font-size: 14px; margin-top: 20px;">
            All prices are displayed in <strong>Sri Lankan Rupees (LKR)</strong><br>
            Data persists in MongoDB
          </p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
async function startServer() {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`
      🚀 Cube Cake Backend Started!
      ===============================
      🌐 Server: http://localhost:${PORT}
      📡 API Base: http://localhost:${PORT}/api
      💰 Currency: Sri Lankan Rupee (LKR)
      🗄️  Database: Persistent MongoDB
      🔌 Connection: mongodb://localhost:27017/cake-shop
      
      📋 Quick Links:
         • http://localhost:${PORT}/              - Dashboard
         • http://localhost:${PORT}/health        - Health Check
         • http://localhost:${PORT}/api/cakes     - Cakes API (LKR)
         • http://localhost:${PORT}/api/stats     - Statistics
         • http://localhost:${PORT}/api-docs      - API Documentation
      
      🔗 Frontend: http://localhost:3000
      🔗 MongoDB Compass: mongodb://localhost:27017/cake-shop
      
      👑 Admin Login: admin@cubecake.com / admin123
      
      Press Ctrl+C to stop
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();