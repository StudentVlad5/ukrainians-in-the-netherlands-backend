import express from "express";
import {
  getPublicProductById,
  getPublicProducts,
  getPublicSpecialistById,
  getPublicSpecialists,
} from "../controllers/publicDetails.controller.js";

const router = express.Router();

router.get("/specialists", getPublicSpecialists);
router.get("/specialists/:id", getPublicSpecialistById);
router.get("/products", getPublicProducts);
router.get("/products/:id", getPublicProductById);

export default router;
