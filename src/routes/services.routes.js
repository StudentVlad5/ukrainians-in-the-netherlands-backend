import express from "express";
import uploadCloud from "../middlewares/uploadMiddleware";
import { auth, requireRole } from "../middlewares/auth.middleware";
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
  auth,
  requireRole(["Saler", "Admin"]),
  uploadCloud.single("avatar"),
  createService
);

router.get("/", getServices);
router.get("/stats", auth, requireRole(["Saler", "Admin"]), getServicesStats);
router.get("/:id", getServiceById);

router.put(
  "/:id",
  auth,
  requireRole(["Saler", "Admin"]),
  uploadCloud.single("avatar"),
  updateService
);

router.delete("/:id", auth, requireRole(["Saler", "Admin"]), deleteService);

export default router;
