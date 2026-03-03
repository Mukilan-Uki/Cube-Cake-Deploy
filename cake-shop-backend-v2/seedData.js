const mongoose = require("mongoose");
require("dotenv").config();

const Cake = require("./models/Cake");
const User = require("./models/User");
const Shop = require("./models/Shop");
// Note: Do NOT manually hash passwords here.
// The User model's pre('save') hook handles bcrypt hashing automatically.

const seedInitialData = async () => {
  try {
    console.log("Seeding database...");

    // CLEAR OLD DATA
    await Cake.deleteMany({});
    await User.deleteMany({});
    await Shop.deleteMany({});
    console.log("Old data cleared");

    // ---------------- ADMIN ----------------
    // Pass plain text password - the User model's pre('save') hook hashes it
    const admin = await User.create({
      name: "Super Admin",
      email: "admin@cubecake.com",
      phone: "0743086099",
      password: "admin123",
      role: "super_admin"
    });

    console.log("Admin created");

    // ---------------- SHOP OWNER ----------------
    // Pass plain text password - the User model's pre('save') hook hashes it
    const owner = await User.create({
      name: "Murugan Cake Shop",
      email: "shop@example.com",
      phone: "0776052968",
      password: "shop123",
      role: "shop_owner"
    });

    console.log("Owner created");

    // ---------------- SHOP ----------------
    const shop = await Shop.create({
      shopName: "Cube Cake",
      shopSlug: "cube-cake",
      owner: owner._id,
      admins: [owner._id],
      email: "cube@gmail.com",
      phone: "0771234567",
      address: {
        street: "123 Main Street",
        city: "Colombo",
        country: "Sri Lanka"
      },
      businessType: "bakery",
      isVerified: true
    });

    console.log("Shop created");

    // link shop → owner
    owner.shopId = shop._id;
    owner.shops = [shop._id];
    await owner.save();

    // ---------------- CAKES ----------------
    const cakes = [
      {
        name: "Chocolate Dream",
        description: "Rich dark chocolate cake",
        priceLKR: 3000,
        category: "Birthday",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        isPopular: true,
        isAvailable: true,
        shop: shop._id,
        shopName: shop.shopName,
        shopSlug: shop.shopSlug
      },
      {
        name: "Vanilla Elegance",
        description: "Classic vanilla sponge",
        priceLKR: 2500,
        category: "Wedding",
        image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e",
        isPopular: true,
        isAvailable: true,
        shop: shop._id,
        shopName: shop.shopName,
        shopSlug: shop.shopSlug
      }
    ];

    await Cake.insertMany(cakes);

    console.log("Cakes inserted");
    console.log("SEED COMPLETE");

    // NOTE: No process.exit() here - this allows the function to be imported
    // and called from other modules without crashing the server.
    // process.exit() is only called when run as a standalone script (see below).

  } catch (err) {
    console.error(err);
    // Only exit with error when running as a standalone script
    if (require.main === module) {
      process.exit(1);
    }
    throw err;
  }
};

// Only connect and run when executed directly as a script: `node seedData.js`
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => seedInitialData())
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { seedInitialData };