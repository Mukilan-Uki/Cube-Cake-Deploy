import express from "express";
const router = express.Router();
import {
  register,
  login,
  registerShop,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

// Public routes
router.post("/register", register);
router.post("/register-shop", registerShop);
router.post("/login-selection", login);

// Protected routes
router.get("/me", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;