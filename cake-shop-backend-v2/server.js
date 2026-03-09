import app from "./app.js";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create default super admin
    const adminExists = await User.findOne({ email: "admin@cubecake.com" });
    if (!adminExists) {
      await User.create({
        name: "Mukilan",
        email: "admin@cubecake.com",
        phone: "0743086099",
        password: "admin123",
        role: "super_admin",
      });
      console.log("Default admin created (admin@cubecake.com / admin123)");
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`
      Cube Cake Server Started!
      Port: ${PORT}
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();