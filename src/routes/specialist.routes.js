import express from "express";
import {
  createSpecialist,
  getSpecialists,
  getSpecialistById,
  updateSpecialist,
  deleteSpecialist,
  hideSpecialist,
} from "../controllers/specialist.controller.js";

const router = express.Router();

router.post("/", createSpecialist);
router.get("/", getSpecialists);
router.get("/:id", getSpecialistById);
router.put("/:id", updateSpecialist);
router.patch("/:id/hide", hideSpecialist);
router.delete("/:id", deleteSpecialist);

export default router;
