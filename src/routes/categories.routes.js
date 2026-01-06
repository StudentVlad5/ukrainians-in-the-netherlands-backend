import express from "express";
import {
  getAllCategories,
  getCategoriesById,
  addCategory,
  updateCategoryById,
  deleteCategoryById,
} from "../controllers/category.controller.js";
import { requireRole, verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  requireRole(["seller", "admin"]),
  getAllCategories
);

router.get(
  "/:id",
  verifyToken,
  requireRole(["seller", "admin"]),
  getCategoriesById
);

router.post("/", verifyToken, requireRole(["seller", "admin"]), addCategory);

router.put(
  "/:id",
  verifyToken,
  requireRole(["seller", "admin"]),
  updateCategoryById
);

router.delete(
  "/:id",
  verifyToken,
  requireRole(["seller", "admin"]),
  deleteCategoryById
);

export default router;
