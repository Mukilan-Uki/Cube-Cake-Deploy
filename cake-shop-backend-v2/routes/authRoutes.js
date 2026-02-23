const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes are working!'
  });
});

// Register shop
router.post('/register-shop', async (req, res) => {
  try {
    const {
      shopName,
      ownerName,
      email,
      phone,
      address,
      password,
      businessType
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new shop owner (admin)
    const newUser = new User({
      name: ownerName,
      email,
      phone,
      password,
      role: 'admin',
      shopDetails: {
        shopName,
        address,
        businessType,
        isApproved: false
      }
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'Shop registration submitted for approval',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Shop registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Registration attempt:', req.body.email);
    
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, email, phone, password'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'customer'
    });

    const token = jwt.sign({ 
      id: user._id,
      email: user.email,
      role: user.role
    }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '30d'
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    console.log('✅ User registered:', user.email);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('❌ Registration error:', error.message);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body.email);
    
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign({ 
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: rememberMe ? '30d' : '1d'
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    console.log('✅ User logged in:', user.email);
    
    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user: user
    });
    
  } catch (error) {
    console.error('Profile error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Not authorized'
    });
  }
});

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      role: 'admin'
    }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }
    
    const token = jwt.sign({ 
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      isAdmin: true
    }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '8h'
    });
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    console.log('✅ Admin logged in:', user.email);
    
    res.json({
      success: true,
      message: 'Admin login successful!',
      token,
      user: userResponse,
      isAdmin: true
    });
    
  } catch (error) {
    console.error('Admin login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during admin login'
    });
  }
});

// Verify admin
router.get('/verify-admin', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    
    res.json({
      success: true,
      message: 'Admin access verified',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Admin verification error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Not authorized'
    });
  }
});

module.exports = router;