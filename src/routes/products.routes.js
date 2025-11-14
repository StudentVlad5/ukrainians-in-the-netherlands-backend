import express from "express";
import uploadCloud from "../middlewares/uploadMiddleware";
import { auth, requireRole } from "../middlewares/auth.middleware";

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
  auth,
  requireRole(["Saler", "Admin"]),
  uploadCloud.array("images", 3),
  createProduct
);

router.get("/", getProducts);
router.get("/stats", auth, requireRole(["Saler", "Admin"]), getProductsStats);
router.get("/:id", getProductById);

router.put(
  "/:id",
  auth,
  requireRole(["Saler", "Admin"]),
  uploadCloud.array("images", 3),
  updateProduct
);

router.delete("/:id", auth, requireRole(["Saler", "Admin"]), deleteProduct);

export default router;
