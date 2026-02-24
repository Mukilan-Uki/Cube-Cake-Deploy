const Order = require('../models/Order');
const Cake = require('../models/Cake');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/stats
// @access  Private/Admin
const getStats = async (req, res, next) => {
  try {
    // Order counts
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const preparingOrders = await Order.countDocuments({ status: 'Preparing' });
    const readyOrders = await Order.countDocuments({ status: 'Ready' });
    const completedOrders = await Order.countDocuments({ status: 'Completed' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

    // Revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Today's revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayRevenueResult = await Order.aggregate([
      { 
        $match: { 
          createdAt: { $gte: today, $lt: tomorrow },
          status: { $ne: 'Cancelled' }
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const todayRevenue = todayRevenueResult[0]?.total || 0;

    // User counts
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // Cake counts
    const totalCakes = await Cake.countDocuments();
    const popularCakes = await Cake.countDocuments({ isPopular: true });
    const newCakes = await Cake.countDocuments({ isNew: true });

    res.json({
      success: true,
      stats: {
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          preparing: preparingOrders,
          ready: readyOrders,
          completed: completedOrders,
          cancelled: cancelledOrders
        },
        revenue: {
          total: parseFloat(totalRevenue.toFixed(2)),
          today: parseFloat(todayRevenue.toFixed(2))
        },
        users: {
          total: totalUsers,
          customers: totalCustomers,
          admins: totalAdmins
        },
        cakes: {
          total: totalCakes,
          popular: popularCakes,
          new: newCakes
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly revenue stats
// @route   GET /api/stats/monthly
// @access  Private/Admin
const getMonthlyStats = async (req, res, next) => {
  try {
    const monthlyStats = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'Cancelled' }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      },
      {
        $sort: {
          '_id.year': -1,
          '_id.month': -1
        }
      },
      {
        $limit: 12
      }
    ]);

    res.json({
      success: true,
      monthlyStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular cakes stats
// @route   GET /api/stats/popular-cakes
// @access  Private/Admin
const getPopularCakesStats = async (req, res, next) => {
  try {
    const popularCakes = await Order.aggregate([
      {
        $group: {
          _id: '$cakeId',
          orderCount: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      },
      {
        $sort: { orderCount: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'cakes',
          localField: '_id',
          foreignField: '_id',
          as: 'cake'
        }
      }
    ]);

    res.json({
      success: true,
      popularCakes
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getMonthlyStats,
  getPopularCakesStats
};