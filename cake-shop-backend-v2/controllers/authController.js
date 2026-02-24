const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Shop = require('../models/Shop');

// Generate JWT Token
const generateToken = (id, role, shopId = null, expiresIn = '30d') => {
  return jwt.sign(
    { id, role, shopId }, 
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn }
  );
};

// @desc    Register a new user (customer)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
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

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Login user (any role)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
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

    const token = generateToken(
      user._id, 
      user.role, 
      user.shopId,
      rememberMe ? '30d' : '1d'
    );

    user.lastLogin = Date.now();
    await user.save();

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        shopId: user.shopId
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Admin/Shop Owner login
// @route   POST /api/auth/admin/login
// @access  Public
const adminLogin = async (req, res, next) => {
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
      role: { $in: ['shop_owner', 'super_admin'] }
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No shop owner account found with this email'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    const token = generateToken(
      user._id, 
      user.role, 
      user.shopId,
      '8h'
    );

    user.lastLogin = Date.now();
    await user.save();

    console.log('✅ Shop owner logged in:', user.email, 'Role:', user.role);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        shopId: user.shopId
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Register as shop owner only (creates user)
// @route   POST /api/auth/register-shop-owner
// @access  Public
const registerShopOwner = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
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
      role: 'shop_owner'
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Shop owner registered successfully! Please register your shop.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Register shop (creates user AND shop in one step)
// @route   POST /api/auth/register-shop
// @access  Public
const registerShop = async (req, res, next) => {
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

    // Validate required fields
    if (!shopName || !ownerName || !email || !phone || !address || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user as shop_owner
    const user = await User.create({
      name: ownerName,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'shop_owner'
    });

    // Generate shop slug
    let shopSlug = shopName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug exists
    const slugExists = await Shop.findOne({ shopSlug });
    if (slugExists) {
      shopSlug = `${shopSlug}-${Date.now()}`;
    }

    // Create shop
    const shop = await Shop.create({
      shopName,
      shopSlug,
      owner: user._id,
      admins: [user._id],
      email,
      phone,
      address: {
        street: address,
        city: '',
        state: '',
        zipCode: '',
        country: 'Sri Lanka'
      },
      businessType: businessType || 'bakery',
      settings: {
        orderPrefix: shopName.substring(0, 3).toUpperCase()
      },
      isVerified: true // Auto-verify for now
    });

    // Update user with shopId
    user.shopId = shop._id;
    user.shops = [shop._id];
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role, shop._id);

    res.status(201).json({
      success: true,
      message: 'Shop registered successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        shopId: shop._id
      },
      shop
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('shopId', 'shopName shopSlug logo isVerified');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        shopId: user.shopId,
        shop: user.shopId
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  adminLogin,
  registerShopOwner,
  registerShop,
  getProfile,
  updateProfile
};