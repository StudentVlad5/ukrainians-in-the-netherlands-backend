import express from "express";
import uploadCloud from "../middlewares/uploadMiddleware";
import { verifyToken, requireRole } from "../middlewares/auth.middleware";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesStats,
} from "../controllers/services.controller.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  requireRole(["seller", "admin"]),
  uploadCloud.single("avatar"),
  createService
);

router.get("/", getServices);
router.get(
  "/stats",
  verifyToken,
  requireRole(["seller", "admin"]),
  getServicesStats
);
router.get("/:id", getServiceById);

router.put(
  "/:id",
  verifyToken,
  requireRole(["seller", "admin"]),
  uploadCloud.single("avatar"),
  updateService
);

router.delete(
  "/:id",
  verifyToken,
  requireRole(["seller", "admin"]),
  deleteService
);

export default router;
