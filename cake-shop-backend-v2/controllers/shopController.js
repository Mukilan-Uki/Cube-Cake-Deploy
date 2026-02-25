const Shop = require('../models/Shop');
const Order = require('../models/Order');
const User = require('../models/User');
const Cake = require('../models/Cake');

// @desc    Register a new shop
// @route   POST /api/shops/register
// @access  Private (Shop Owner only)
const registerShop = async (req, res, next) => {
  try {
    const {
      shopName,
      description,
      email,
      phone,
      address,
      businessType,
      operatingHours
    } = req.body;

    // Check if user already has a shop
    const existingShop = await Shop.findOne({ owner: req.user.id });
    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: 'You already have a registered shop'
      });
    }

    // Generate shop slug
    let shopSlug = shopName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug is unique
    const slugExists = await Shop.findOne({ shopSlug });
    if (slugExists) {
      shopSlug = `${shopSlug}-${Date.now()}`;
    }

    // Create shop
    const shop = await Shop.create({
      shopName,
      shopSlug,
      description,
      owner: req.user.id,
      admins: [req.user.id],
      email,
      phone,
      address: {
        street: address,
        city: '',
        state: '',
        zipCode: '',
        country: 'Sri Lanka'
      },
      businessType,
      operatingHours: operatingHours || [],
      settings: {
        orderPrefix: shopName.substring(0, 3).toUpperCase()
      }
    });

    // Update user with shopId
    await User.findByIdAndUpdate(req.user.id, {
      shopId: shop._id,
      shops: [shop._id]
    });

    res.status(201).json({
      success: true,
      message: 'Shop registered successfully!',
      shop
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get shop dashboard
// @route   GET /api/shops/dashboard
// @access  Private (Shop Owner only)
const getShopDashboard = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalOrders,
      pendingOrders,
      preparingOrders,
      readyOrders,
      completedOrders,
      todaysOrders,
      recentOrders,
      revenue,
      totalCakes
    ] = await Promise.all([
      Order.countDocuments({ shop: shopId }),
      Order.countDocuments({ shop: shopId, status: 'pending' }),
      Order.countDocuments({ shop: shopId, status: 'preparing' }),
      Order.countDocuments({ shop: shopId, status: 'ready' }),
      Order.countDocuments({ shop: shopId, status: 'completed' }),
      Order.find({ 
        shop: shopId,
        createdAt: { $gte: today, $lt: tomorrow }
      }).sort({ createdAt: -1 }),
      Order.find({ shop: shopId })
        .sort({ createdAt: -1 })
        .limit(10),
      Order.aggregate([
        { $match: { 
          shop: shopId,
          status: { $in: ['completed', 'delivered'] }
        }},
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Cake.countDocuments({ shop: shopId })
    ]);

    res.json({
      success: true,
      dashboard: {
        shop,
        stats: {
          totalOrders,
          pendingOrders,
          preparingOrders,
          readyOrders,
          completedOrders,
          totalRevenue: revenue[0]?.total || 0,
          todaysOrders: todaysOrders.length,
          totalCakes
        },
        todaysOrders,
        recentOrders
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get shop orders
// @route   GET /api/shops/orders
// @access  Private (Shop Owner only)
const getShopOrders = async (req, res, next) => {
  try {
    const shopId = req.user.shopId;
    const { status, page = 1, limit = 20 } = req.query;

    const query = { shop: shopId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(query)
    ]);

    res.json({
      success: true,
      orders,
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

// @desc    Update order status
// @route   PUT /api/shops/orders/:orderId/status
// @access  Private (Shop Owner only)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;
    const shopId = req.user.shopId;

    const order = await Order.findOne({ 
      orderId: orderId,
      shop: shopId 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Validate status transition
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'completed', 'cancelled', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      updatedBy: req.user.id,
      note: note || `Status changed to ${status}`,
      timestamp: new Date()
    });

    // Set timestamps based on status
    const now = new Date();
    switch (status) {
      case 'confirmed':
        order.confirmedAt = now;
        break;
      case 'ready':
        order.actualReadyTime = now;
        break;
      case 'delivered':
      case 'completed':
        order.paymentStatus = 'paid';
        order.paidAt = now;
        break;
      case 'cancelled':
      case 'rejected':
        order.cancelledAt = now;
        order.cancellationReason = note;
        break;
    }

    await order.save();

    // Update shop stats if completed
    if (status === 'completed' || status === 'delivered') {
      await Shop.findByIdAndUpdate(shopId, {
        $inc: { 
          'stats.totalRevenue': order.totalPrice,
          'stats.completedOrders': 1 
        }
      });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get shop settings
// @route   GET /api/shops/settings
// @access  Private (Shop Owner only)
const getShopSettings = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.user.shopId);
    
    res.json({
      success: true,
      settings: shop
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update shop settings
// @route   PUT /api/shops/settings
// @access  Private (Shop Owner only)
const updateShopSettings = async (req, res, next) => {
  try {
    const shop = await Shop.findByIdAndUpdate(
      req.user.shopId,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Shop settings updated',
      shop
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerShop,
  getShopDashboard,
  getShopOrders,
  updateOrderStatus,
  getShopSettings,
  updateShopSettings
};