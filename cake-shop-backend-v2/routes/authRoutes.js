import express from "express";
const router = express.Router();
import {
  register,
  login,
  registerShop,
  getProfile,
  updateProfile,
  checkEmail,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

// Public routes
router.post("/register", register);
router.post("/register-shop", registerShop);
router.post("/check-email", checkEmail);
router.post("/login-selection", login);
router.post("/admin/login", login);

// Protected routes
router.get("/me", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;