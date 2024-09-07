import express from "express";
import ProductController from "../controllers/product.controller";
import { adminRoute, authRoute } from "../middlewares/authenticate";

const router = express.Router();

router.get("/", authRoute, adminRoute, ProductController.getAllProducts);
router.get("/featured", ProductController.getFeaturedProducts);
router.get("/category/:category", ProductController.getProductsByCategory);
router.get("/recommendations", ProductController.getRecommendedProducts);
router.post("/", authRoute, adminRoute, ProductController.createProduct);
router.patch("/:id", authRoute, adminRoute, ProductController.toggleFeaturedProduct);
router.delete("/:id", authRoute, adminRoute, ProductController.removeProduct);

export default router;