import express from "express";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orders.controller.js";
import { requireRole, verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Маршрути
router.get("/", getAllOrders); // Отримати всі (приклад: /orders?page=1&limit=5)
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.patch("/:id", verifyToken, requireRole(["admin"]), updateOrder);
router.delete("/:id", verifyToken, requireRole(["admin"]), deleteOrder);

export default router;
