import express from "express";
const router = express.Router();
import { protect } from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import * as adminController from "../controllers/adminController.js";

// All admin routes require auth + super_admin role
router.use(protect, admin);

// USERS
router.get("/users", adminController.getAllUsers);
router.patch("/users/:userId/toggle", adminController.toggleUserActive);

// SHOPS
router.get("/shops", adminController.getAllShops);
router.patch("/shops/:shopId/verify", adminController.verifyShop);
router.patch("/shops/:shopId/toggle", adminController.toggleShopActive);

// ORDERS
router.get("/orders", adminController.getAllOrders);
router.patch("/orders/:orderId/status", adminController.updateOrderStatus);

// PLATFORM STATS
router.get("/stats", adminController.getPlatformStats);

// CAKES
router.get("/cakes", adminController.getAllCakes);
router.post("/cakes", adminController.createCake);
router.put("/cakes/:cakeId", adminController.updateCake);
router.delete("/cakes/:cakeId", adminController.deleteCake);

export default router;
