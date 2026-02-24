const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const shopRoutes = require('./routes/shopRoutes');
const orderRoutes = require('./routes/orderRoutes');
const publicRoutes = require('./routes/publicRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/public', publicRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    currency: 'LKR'
  });
});

// List all routes (debug only)
app.get('/api/routes', (req, res) => {
  const routes = [];
  
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          const path = handler.route.path;
          const methods = Object.keys(handler.route.methods);
          routes.push({
            path: `/api${path}`,
            methods
          });
        }
      });
    }
  });
  
  res.json({
    success: true,
    routes
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Cube Cake API',
    version: '1.0.0',
    currency: 'LKR',
    endpoints: {
      auth: '/api/auth',
      shops: '/api/shops',
      orders: '/api/orders',
      public: '/api/public',
      debug: '/api/routes'
    }
  });
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
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', ')
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value entered'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cake-shop';
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    
    // Create default super admin if not exists
    const User = require('./models/User');
    const adminExists = await User.findOne({ email: 'admin@cubecake.com' });
    
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@cubecake.com',
        phone: '0743086099',
        password: 'admin123',
        role: 'super_admin'
      });
      console.log('✅ Default admin created (admin@cubecake.com / admin123)');
    }
    
    app.listen(PORT, () => {
      console.log(`
      🚀 Cube Cake Server Started!
      =============================
      🌐 Port: ${PORT}
      💰 Currency: LKR
      📁 Database: MongoDB
      
      📋 Available Auth Endpoints:
      • POST /api/auth/register - Customer registration
      • POST /api/auth/login - User login (any role)
      • POST /api/auth/admin/login - Shop owner login
      • POST /api/auth/register-shop-owner - Register as shop owner
      • POST /api/auth/register-shop - Register shop (creates user + shop)
      
      🔗 Frontend: http://localhost:3000
      `);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();