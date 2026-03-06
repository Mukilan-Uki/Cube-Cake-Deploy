import Order from "../models/Order.js";
import Shop from "../models/Shop.js";
import { sizePrices, baseAdditional, frostingAdditional, toppingAdditional } from '../utils/constants.js'

// Helper function to calculate price
const calculatePrice = (cakeDetails, shop) => {
  // Use lowercase ID lookup or fallback
  const sizeData = sizePrices[cakeDetails.size?.toLowerCase()] || sizePrices.medium;
  const basePrice = sizeData?.price || 0;

  const baseFlavorData = baseAdditional[cakeDetails.base?.toLowerCase()] || { price: 0 };
  const baseFlavorPrice = baseFlavorData.price || 0;

  const frostingData = frostingAdditional[cakeDetails.frosting?.toLowerCase()] || { price: 0 };
  const frostingPrice = frostingData.price || 0;

  const toppingsPrice = (cakeDetails.toppings || []).reduce(
    (total, toppingId) => {
      const toppingData = toppingAdditional[toppingId?.toLowerCase()] || { price: 0 };
      return total + (toppingData.price || 0);
    },
    0
  );

  const extraLayers = Math.max(0, (cakeDetails.layers || 2) - 2);
  const layersPrice = extraLayers * 1500; // PRICING.EXTRA_LAYER_PRICE

  // Guard against undefined deliveryFee from shop settings
  const deliveryFee = shop.settings?.deliveryFee || 1500;

  return {
    basePrice: Number(basePrice),
    baseFlavorPrice: Number(baseFlavorPrice),
    frostingPrice: Number(frostingPrice),
    toppingsPrice: Number(toppingsPrice),
    layersPrice: Number(layersPrice),
    deliveryFee: Number(deliveryFee),
    discount: 0,
    tax: 0,
  };
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const {
      shopId,
      deliveryDate,
      deliveryType,
      deliveryAddress,
      cakeDetails,
      paymentMethod,
      specialInstructions,
    } = req.body;

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    if (!shop.isActive || !shop.isVerified) {
      return res.status(400).json({
        success: false,
        message: "This shop is currently not accepting orders",
      });
    }

    // If a galleryCakePriceLKR is provided (gallery/shop cake order), use it directly
    let priceBreakdown, totalPrice;
    if (
      req.body.galleryCakePriceLKR &&
      Number(req.body.galleryCakePriceLKR) > 0
    ) {
      const deliveryFee =
        deliveryType === "delivery" ? shop.settings?.deliveryFee || 150 : 0;
      priceBreakdown = {
        basePrice: Number(req.body.galleryCakePriceLKR),
        deliveryFee,
      };
      totalPrice = priceBreakdown.basePrice + priceBreakdown.deliveryFee;
    } else {
      priceBreakdown = calculatePrice(cakeDetails, shop);

      // Set delivery fee to 0 if not a delivery order
      if (deliveryType !== "delivery") {
        priceBreakdown.deliveryFee = 0;
      }

      totalPrice = Object.values(priceBreakdown).reduce(
        (sum, price) => sum + price,
        0
      );
    }

    const orderId = `${shop.settings.orderPrefix
      }-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = await Order.create({
      orderId,
      shop: shopId,
      user: req.user.id,
      customerName: req.user.name,
      customerPhone: req.user.phone,
      customerEmail: req.user.email,

      deliveryDate: new Date(deliveryDate),
      deliveryType,
      deliveryAddress: deliveryType === "delivery" ? deliveryAddress : null,

      cakeDetails: {
        base: cakeDetails.base,
        frosting: cakeDetails.frosting,
        size: cakeDetails.size,
        layers: cakeDetails.layers || 2,
        toppings: cakeDetails.toppings || [],
        message: cakeDetails.message || "",
        colors: cakeDetails.colors || {
          cake: "#8B4513",
          frosting: "#FFF5E6",
          decorations: "#FF6B8B",
        },
        specialInstructions: specialInstructions || "",
      },

      priceBreakdown,
      totalPrice,
      currency: shop.settings.currency,

      paymentMethod,
      paymentStatus: paymentMethod === "cash" ? "pending" : "pending",

      status: "pending",
      statusHistory: [
        {
          status: "pending",
          updatedBy: req.user.id,
          note: "Order placed successfully",
          timestamp: new Date(),
        },
      ],

      estimatedReadyTime: new Date(
        Date.now() + (shop.settings.preparationTime || 120) * 60000
      ),

      customerNotes: specialInstructions || "",
    });

    await Shop.findByIdAndUpdate(shopId, {
      $inc: { "stats.totalOrders": 1 },
    });

    await order.populate([
      { path: "shop", select: "shopName shopSlug address phone" },
      { path: "user", select: "name email phone" },
    ]);

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// get my orders
export const getMyOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };
    if (status && status !== "all") {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("shop", "shopName shopSlug address phone logo")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(query),
    ]);

    const summary = await Order.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalPrice" },
          completedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          pendingOrders: {
            $sum: {
              $cond: [
                { $in: ["$status", ["pending", "confirmed", "preparing"]] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    res.json({
      success: true,
      orders,
      summary: summary[0] || {
        totalOrders: 0,
        totalSpent: 0,
        completedOrders: 0,
        pendingOrders: 0,
      },
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

// get single order
export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId })
      .populate("shop", "shopName shopSlug address phone email logo settings")
      .populate("user", "name email phone")
      .populate("statusHistory.updatedBy", "name role");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const isOwner = order.user._id.toString() === req.user.id;
    const isShopOwner =
      req.user.role === "shop_owner" &&
      order.shop._id.toString() === req.user.shopId?.toString();
    const isAdmin = req.user.role === "super_admin";

    if (!isOwner && !isShopOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// cancel order
export const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const isOwner = order.user.toString() === req.user.id;
    const isShopOwner =
      req.user.role === "shop_owner" &&
      order.shop.toString() === req.user.shopId?.toString();

    if (!isOwner && !isShopOwner) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order",
      });
    }

    const cancellableStatuses = ["pending", "confirmed"];
    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is ${order.status}`,
      });
    }

    order.status = "cancelled";
    order.statusHistory.push({
      status: "cancelled",
      updatedBy: req.user.id,
      note: reason || "Order cancelled by user",
      timestamp: new Date(),
    });
    order.cancelledAt = new Date();
    order.cancellationReason = reason;

    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// track order
export const trackOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { phone } = req.query;

    const order = await Order.findOne({ orderId })
      .populate("shop", "shopName phone address")
      .select(
        "orderId status statusHistory estimatedReadyTime actualReadyTime customerName customerPhone"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (phone && order.customerPhone !== phone) {
      return res.status(403).json({
        success: false,
        message: "Invalid phone number for this order",
      });
    }

    const timeline = order.statusHistory.map((history) => ({
      status: history.status,
      note: history.note,
      timestamp: history.timestamp,
    }));

    res.json({
      success: true,
      tracking: {
        orderId: order.orderId,
        status: order.status,
        customerName: order.customerName,
        estimatedReadyTime: order.estimatedReadyTime,
        actualReadyTime: order.actualReadyTime,
        shop: order.shop,
        timeline,
      },
    });
  } catch (error) {
    next(error);
  }
};