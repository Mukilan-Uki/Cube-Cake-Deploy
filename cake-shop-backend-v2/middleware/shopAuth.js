const isShopOwner = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  if (req.user.role !== 'shop_owner' && req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Shop owner privileges required.'
    });
  }

  if (!req.user.shopId && req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'You need to register a shop first'
    });
  }

  next();
};

module.exports = { isShopOwner };