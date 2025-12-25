import express from "express";
import {
  getPublicSpecialistById,
  getPublicSpecialists,
} from "../controllers/publicDetails.controller.js";

const router = express.Router();

router.get("/specialists", getPublicSpecialists);
router.get("/specialists/:id", getPublicSpecialistById);

export default router;
