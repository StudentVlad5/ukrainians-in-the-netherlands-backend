import express from "express";
import {
  createSpecialist,
  getSpecialists,
  getSpecialistById,
  updateSpecialist,
  deleteSpecialist,
} from "../controllers/specialist.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";
import { uploadSpecialistImages } from "../middlewares/uploadMiddleware.js";
import { isSpecialistOwner } from "../middlewares/isSpecialistOwner.middleware.js";
const router = express.Router();

router.post(
  "/",
  verifyToken,
  requireRole(["admin", "seller"]),
  uploadSpecialistImages,
  createSpecialist
);

router.get("/", verifyToken, requireRole(["admin", "seller"]), getSpecialists);
router.get(
  "/:id",
  verifyToken,
  requireRole(["admin", "seller"]),
  isSpecialistOwner,
  getSpecialistById
);
router.put(
  "/:id",
  verifyToken,
  requireRole(["admin", "seller"]),
  isSpecialistOwner,
  uploadSpecialistImages,
  updateSpecialist
);
router.delete(
  "/:id",
  verifyToken,
  requireRole(["admin", "seller"]),
  isSpecialistOwner,
  deleteSpecialist
);

export default router;
