import express from "express";
const router = express.Router();
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  trackOrder,
} from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";

// Public route for tracking
router.get("/track/:orderId", trackOrder);

// Protected routes
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:orderId", protect, getOrderById);
router.put("/:orderId/cancel", protect, cancelOrder);

export default router;