import express from "express";
import uploadCloud from "../middlewares/uploadMiddleware.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsStats,
} from "../controllers/products.controller.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  requireRole(["seller", "admin"]),
  uploadCloud.array("images", 3),
  createProduct
);

router.get("/", getProducts);
router.get(
  "/stats",
  verifyToken,
  requireRole(["seller", "admin"]),
  getProductsStats
);
router.get("/:id", getProductById);

router.put(
  "/:id",
  verifyToken,
  requireRole(["seller", "admin"]),
  uploadCloud.array("images", 3),
  updateProduct
);

router.delete(
  "/:id",
  verifyToken,
  requireRole(["seller", "admin"]),
  deleteProduct
);

export default router;
