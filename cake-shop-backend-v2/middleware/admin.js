// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === "super_admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized as admin",
    });
  }
};

export default admin;