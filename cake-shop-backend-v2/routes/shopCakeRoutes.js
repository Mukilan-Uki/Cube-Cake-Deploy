import express from "express";
const router = express.Router();
import {
  getMyCakes,
  addCake,
  updateCake,
  deleteCake,
  toggleAvailability,
  togglePopular,
} from "../controllers/shopCakeController.js";
import { protect, shopOwner } from "../middleware/auth.js";

// All routes require authentication and shop owner role
router.use(protect, shopOwner);

// GET /api/shops/my-cakes - Get all cakes for logged in shop owner
router.get("/my-cakes", getMyCakes);

// POST /api/shops/cakes - Add new cake
router.post("/cakes", addCake);

// PUT /api/shops/cakes/:id - Update cake
router.put("/cakes/:id", updateCake);

// DELETE /api/shops/cakes/:id - Delete cake
router.delete("/cakes/:id", deleteCake);

// PATCH /api/shops/cakes/:id/toggle - Toggle availability
router.patch("/cakes/:id/toggle", toggleAvailability);

// PATCH /api/shops/cakes/:id/popular - Toggle popular status
router.patch("/cakes/:id/popular", togglePopular);

export default router;