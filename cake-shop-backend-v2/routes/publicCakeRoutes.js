import express from "express";
const router = express.Router();
import {
  getAllCakes,
  getFeaturedCakes,
  getCakeById,
  getCakesByShop,
} from "../controllers/publicCakeController.js";

// All routes are public
router.get("/cakes", getAllCakes);
router.get("/cakes/featured", getFeaturedCakes);
router.get("/cakes/:id", getCakeById);
router.get("/shops/:shopId/cakes", getCakesByShop);

export default router;