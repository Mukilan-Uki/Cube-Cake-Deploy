import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Shop from "../models/Shop.js";

// Generate JWT Token
const generateToken = (id, role, shopId = null, expiresIn = "30d") => {
  return jwt.sign({ id, role, shopId }, process.env.JWT_SECRET, { expiresIn });
};

// Register new user
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: "customer",
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture || "",
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user (any role)
export const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = generateToken(
      user._id,
      user.role,
      user.shopId,
      rememberMe ? "30d" : "1d"
    );

    user.lastLogin = Date.now();
    await user.save();

    res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        shopId: user.shopId,
        profilePicture: user.profilePicture || "",
      },
    });
  } catch (error) {
    next(error);
  }
};

// Register Shop and Shop owner
export const registerShop = async (req, res, next) => {
  try {
    const {
      shopName,
      ownerName,
      email,
      phone,
      address,
      password,
      businessType,
    } = req.body;

    if (!shopName || !ownerName || !email || !phone || !address || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const user = await User.create({
      name: ownerName,
      email: email.toLowerCase(),
      phone,
      password,
      role: "shop_owner",
    });

    let shopSlug = shopName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const slugExists = await Shop.findOne({ shopSlug });
    if (slugExists) {
      shopSlug = `${shopSlug}-${Date.now()}`;
    }

    const shop = await Shop.create({
      shopName,
      shopSlug,
      owner: user._id,
      admins: [user._id],
      email,
      phone,
      address: {
        street: address,
        city: "",
        state: "",
        zipCode: "",
        country: "Sri Lanka",
      },
      businessType: businessType || "bakery",
      settings: {
        orderPrefix: shopName.substring(0, 3).toUpperCase(),
      },
      isVerified: true, // Auto-verify for now
    });

    user.shopId = shop._id;
    user.shops = [shop._id];
    await user.save();

    const token = generateToken(user._id, user.role, shop._id);

    res.status(201).json({
      success: true,
      message: "Shop registered successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        shopId: shop._id,
        profilePicture: user.profilePicture || "",
      },
      shop,
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "shopId",
      "shopName shopSlug logo isVerified"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
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
        shop: user.shopId,
        profilePicture: user.profilePicture || "",
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, profilePicture } = req.body;

    const updateData = { name, phone, updatedAt: Date.now() };
    if (profilePicture !== undefined) {
      updateData.profilePicture = profilePicture;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Check if email is already taken
export const checkEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.json({
        success: false,
        isAvailable: false,
        message: "Email is already taken",
      });
    }

    res.json({
      success: true,
      isAvailable: true,
      message: "Email is available",
    });
  } catch (error) {
    next(error);
  }
};