import express from "express";
import {
  getAllEvents,
  getEventById,
  addEvent,
  updateEventById,
  deleteEventById,
} from "../controllers/events.controller.js";
import { requireRole, verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, requireRole(["seller", "admin"]), getAllEvents);

router.get("/:id", verifyToken, requireRole(["seller", "admin"]), getEventById);

router.post("/", verifyToken, requireRole(["seller", "admin"]), addEvent);

router.put(
  "/:id",
  verifyToken,
  requireRole(["seller", "admin"]),
  updateEventById
);

router.delete(
  "/:id",
  verifyToken,
  requireRole(["seller", "admin"]),
  deleteEventById
);

export default router;
