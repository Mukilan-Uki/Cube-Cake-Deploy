import Shop from "../models/Shop.js";
import Cake from "../models/Cake.js";

//  Get all verified and active shops

export const getAllPublicShops = async (req, res, next) => {
  try {
    const { city, limit = 20, page = 1 } = req.query;

    const query = {
      isActive: true,
      isVerified: true,
    };

    if (city) {
      query["address.city"] = city;
    }

    const skip = (page - 1) * limit;

    const [shops, total] = await Promise.all([
      Shop.find(query)
        .select(
          "shopName shopSlug description logo address phone operatingHours stats"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Shop.countDocuments(query),
    ]);

    res.json({
      success: true,
      shops,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

//  Get shop details and its cakes by slug

export const getPublicShopBySlug = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({
      shopSlug: req.params.slug,
      isActive: true,
    }).select("-admins -settings.holidays");

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // Get shop's cakes
    const cakes = await Cake.find({
      shop: shop._id,
      isAvailable: true,
    });

    res.json({
      success: true,
      shop,
      cakes,
    });
  } catch (error) {
    next(error);
  }
};

// Get cakes for a specific shop

export const getPublicShopCakes = async (req, res, next) => {
  try {
    const cakes = await Cake.find({
      shop: req.params.shopId,
      isAvailable: true,
    });

    res.json({
      success: true,
      cakes,
    });
  } catch (error) {
    next(error);
  }
};
