import express from "express";
import {
  getActiveEvents,
  getActiveEventById,
  addActiveEvent,
  updateActiveEventById,
  deleteActiveEventById,
} from "../controllers/activeEvents.controller.js";
import { requireRole, verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, requireRole(["seller", "admin"]), getActiveEvents);

router.get(
  "/:id",
  verifyToken,
  requireRole(["seller", "admin"]),
  getActiveEventById
);

router.post("/", verifyToken, requireRole(["seller", "admin"]), addActiveEvent);

router.put(
  "/:id",
  verifyToken,
  requireRole(["seller", "admin"]),
  updateActiveEventById
);

router.delete(
  "/:id",
  verifyToken,
  requireRole(["seller", "admin"]),
  deleteActiveEventById
);

export default router;
