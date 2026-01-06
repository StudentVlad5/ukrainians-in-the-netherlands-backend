import express from "express";
import {
  getAllEvents,
  getEventById,
  addEvent,
  updateEventById,
  deleteEventById,
} from "../controllers/events.controller.js";
import { requireRole, verifyToken } from "../middlewares/auth.middleware.js";
import { uploadEvents } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, requireRole(["seller", "admin"]), getAllEvents);

router.get("/:id", verifyToken, requireRole(["seller", "admin"]), getEventById);

router.post(
  "/",
  verifyToken,
  requireRole(["seller", "admin"]),
  uploadEvents.array("images", 3),
  addEvent
);

router.put(
  "/:id",
  verifyToken,
  requireRole(["seller", "admin"]),
  uploadEvents.array("images", 3),
  updateEventById
);

router.delete(
  "/:id",
  verifyToken,
  requireRole(["seller", "admin"]),
  deleteEventById
);

export default router;
