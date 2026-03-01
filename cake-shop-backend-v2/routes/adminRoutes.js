const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Shop = require('../models/Shop');
const Order = require('../models/Order');

// All admin routes require auth + super_admin role
router.use(protect, admin);

// ─── USERS ───────────────────────────────────────────────
// GET all users
router.get('/users', async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      User.countDocuments(query)
    ]);
    res.json({ success: true, users, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// PATCH toggle user active status
router.patch('/users/:userId/toggle', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'super_admin') return res.status(400).json({ success: false, message: 'Cannot deactivate a super admin' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (err) { next(err); }
});

// ─── SHOPS ───────────────────────────────────────────────
// GET all shops (including unverified)
router.get('/shops', async (req, res, next) => {
  try {
    const { verified, page = 1, limit = 20 } = req.query;
    const query = {};
    if (verified === 'true') query.isVerified = true;
    if (verified === 'false') query.isVerified = false;
    const skip = (page - 1) * limit;
    const [shops, total] = await Promise.all([
      Shop.find(query)
        .populate('owner', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Shop.countDocuments(query)
    ]);
    res.json({ success: true, shops, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// PATCH verify a shop
router.patch('/shops/:shopId/verify', async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    shop.isVerified = true;
    shop.isActive = true;
    await shop.save();
    res.json({ success: true, message: 'Shop verified and activated', shop });
  } catch (err) { next(err); }
});

// PATCH toggle shop active status (suspend/unsuspend)
router.patch('/shops/:shopId/toggle', async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    shop.isActive = !shop.isActive;
    await shop.save();
    res.json({ success: true, message: `Shop ${shop.isActive ? 'activated' : 'suspended'}`, shop });
  } catch (err) { next(err); }
});

// ─── ALL ORDERS (platform-wide) ──────────────────────────
router.get('/orders', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('shop', 'shopName shopSlug')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(query)
    ]);
    res.json({ success: true, orders, total });
  } catch (err) { next(err); }
});

// PATCH order status (admin override)
router.patch('/orders/:orderId/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.status = status;
    order.statusHistory.push({ status, updatedBy: req.user.id, note: 'Updated by admin', timestamp: new Date() });
    await order.save();
    res.json({ success: true, message: 'Order status updated', order });
  } catch (err) { next(err); }
});

// ─── PLATFORM STATS ──────────────────────────────────────
router.get('/stats', async (req, res, next) => {
  try {
    const [
      totalOrders, totalRevResult, totalUsers, totalShops,
      verifiedShops, pendingShops, totalCustomers, totalShopOwners,
      recentOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $match: { status: { $nin: ['cancelled', 'rejected'] } } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      User.countDocuments(),
      Shop.countDocuments(),
      Shop.countDocuments({ isVerified: true }),
      Shop.countDocuments({ isVerified: false }),
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'shop_owner' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('shop', 'shopName').populate('user', 'name')
    ]);

    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const byStatus = {};
    statusCounts.forEach(s => { byStatus[s._id] = s.count; });

    // Monthly revenue last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthly = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $nin: ['cancelled', 'rejected'] } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        orders: { total: totalOrders, byStatus },
        revenue: { total: totalRevResult[0]?.total || 0 },
        users: { total: totalUsers, customers: totalCustomers, shopOwners: totalShopOwners },
        shops: { total: totalShops, verified: verifiedShops, pending: pendingShops },
        monthly,
        recentOrders
      }
    });
  } catch (err) { next(err); }
});

// ─── CAKE MANAGEMENT (Admin) ──────────────────────────
const Cake = require('../models/Cake');

// GET all cakes (admin)
router.get('/cakes', async (req, res, next) => {
  try {
    const cakes = await Cake.find().populate('shop', 'shopName shopSlug').sort({ createdAt: -1 });
    res.json({ success: true, cakes });
  } catch (err) { next(err); }
});

// POST create cake (admin assigns to a shop)
router.post('/cakes', async (req, res, next) => {
  try {
    const { shopId, name, description, priceLKR, category, image, isAvailable, isPopular } = req.body;
    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });

    const cake = await Cake.create({
      shop: shop._id,
      shopName: shop.shopName,
      shopSlug: shop.shopSlug,
      name, description, priceLKR, category, image, isAvailable, isPopular
    });
    res.status(201).json({ success: true, message: 'Cake created', cake });
  } catch (err) { next(err); }
});

// PUT update cake (admin)
router.put('/cakes/:cakeId', async (req, res, next) => {
  try {
    const { shopId, ...rest } = req.body;
    const updateData = { ...rest, updatedAt: Date.now() };
    // If shopId changed, update shop details
    if (shopId) {
      const shop = await Shop.findById(shopId);
      if (shop) {
        updateData.shop = shop._id;
        updateData.shopName = shop.shopName;
        updateData.shopSlug = shop.shopSlug;
      }
    }
    const cake = await Cake.findByIdAndUpdate(req.params.cakeId, updateData, { new: true });
    if (!cake) return res.status(404).json({ success: false, message: 'Cake not found' });
    res.json({ success: true, message: 'Cake updated', cake });
  } catch (err) { next(err); }
});

// DELETE cake (admin)
router.delete('/cakes/:cakeId', async (req, res, next) => {
  try {
    const cake = await Cake.findByIdAndDelete(req.params.cakeId);
    if (!cake) return res.status(404).json({ success: false, message: 'Cake not found' });
    res.json({ success: true, message: 'Cake deleted' });
  } catch (err) { next(err); }
});


module.exports = router;
