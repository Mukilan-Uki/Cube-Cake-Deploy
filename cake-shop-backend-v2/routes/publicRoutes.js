import express from "express";
const router = express.Router();
import * as publicShopController from "../controllers/publicShopController.js";

// Get all shops
router.get("/shops", publicShopController.getAllPublicShops);

// Get shop by slug
router.get("/shops/:slug", publicShopController.getPublicShopBySlug);

// Get shop's cakes
router.get("/shops/:shopId/cakes", publicShopController.getPublicShopCakes);

export default router;