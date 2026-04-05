import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: [true, "Shop name is required"],
    trim: true,
  },
  shopSlug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  logo: {
    type: String,
    default: "https://www.google.com/imgres?q=icing%20cake%20shop%20logo&imgurl=https%3A%2F%2Fwww.designmantic.com%2Flogo-images%2F11949.png%3Fcompany%3DCompany%2520Name%26keyword%3Dcake%2520shop%26slogan%3D%26verify%3D1&imgrefurl=https%3A%2F%2Fwww.designmantic.com%2Flogos%2Fsearch%2Fcake-shop&docid=kuTmRpKzpQxCHM&tbnid=d0LTOrcrpYq32M&vet=12ahUKEwiitsDUx5qTAxUwxTgGHTwVIgUQnPAOegQIJxAB..i&w=440&h=338&hcb=2&ved=2ahUKEwiitsDUx5qTAxUwxTgGHTwVIgUQnPAOegQIJxAB",
  },
  coverImage: {
    type: String,
    default: "https://www.google.com/imgres?q=icing%20cake%20shop%20cover&imgurl=https%3A%2F%2Fwww.designmantic.com%2Flogo-images%2F11949.png%3Fcompany%3DCompany%2520Name%26keyword%3Dcake%2520shop%26slogan%3D%26verify%3D1&imgrefurl=https%3A%2F%2Fwww.designmantic.com%2Flogos%2Fsearch%2Fcake-shop&docid=kuTmRpKzpQxCHM&tbnid=d0LTOrcrpYq32M&vet=12ahUKEwiitsDUx5qTAxUwxTgGHTwVIgUQnPAOegQIJxAB..i&w=440&h=338&hcb=2&ved=2ahUKEwiitsDUx5qTAxUwxTgGHTwVIgUQnPAOegQIJxAB",
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  whatsapp: String,

  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: "Sri Lanka" },
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [80.7718, 7.8731], // Default to Sri Lanka center
    },
  },

  businessType: {
    type: String,
    enum: ["bakery", "cafe", "home_business", "patisserie"],
    default: "bakery",
  },
  registrationNumber: String,
  taxId: String,

  settings: {
    currency: { type: String, default: "LKR" },
    timezone: { type: String, default: "Asia/Colombo" },
    orderPrefix: { type: String, default: "ORD" },
    autoAcceptOrders: { type: Boolean, default: false },
    preparationTime: { type: Number, default: 120 },
    maxOrdersPerDay: { type: Number, default: 50 },
    deliveryRadius: { type: Number, default: 10 },
    deliveryFee: { type: Number, default: 150 },
    freeDeliveryThreshold: { type: Number, default: 5000 },
  },

  operatingHours: [
    {
      day: {
        type: String,
        enum: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
      },
      open: { type: String, default: "09:00" },
      close: { type: String, default: "18:00" },
      closed: { type: Boolean, default: false },
    },
  ],

  holidays: [
    {
      date: Date,
      reason: String,
    },
  ],

  paymentMethods: [
    {
      type: String,
      enum: ["cash", "card", "online"],
      default: ["cash"],
    },
  ],

  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
  },

  stats: {
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
  },

  isActive: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
shopSchema.index({ location: "2dsphere" });
shopSchema.index({ shopSlug: 1 }, { unique: true });
shopSchema.index({ owner: 1 });
shopSchema.index({ isActive: 1, isVerified: 1 });

// Pre-save middleware
shopSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Set default operating hours if not provided
shopSchema.pre("save", function (next) {
  if (!this.operatingHours || this.operatingHours.length === 0) {
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    this.operatingHours = days.map((day) => ({
      day,
      open: "09:00",
      close: "18:00",
      closed: day === "sunday",
    }));
  }
  next();
});

const Shop = mongoose.model("Shop", shopSchema);
export default Shop;