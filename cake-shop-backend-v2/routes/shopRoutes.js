import express from "express";
const router = express.Router();
import {
  getShopDashboard,
  getShopOrders,
  updateOrderStatus,
  getShopSettings,
  updateShopSettings,
} from "../controllers/shopController.js";
import { protect, shopOwner } from "../middleware/auth.js";

// All shop routes require authentication and shop owner role
router.use(protect, shopOwner);

// Dashboard
router.get("/dashboard", getShopDashboard);

// Orders
router.get("/orders", getShopOrders);
router.put("/orders/:orderId/status", updateOrderStatus);

// Settings
router.get("/settings", getShopSettings);
router.put("/settings", updateShopSettings);

export default router;