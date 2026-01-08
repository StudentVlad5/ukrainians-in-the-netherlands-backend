import express from "express";
import {
  getPublicProductById,
  getPublicProducts,
  getPublicProductsWithLimits,
  getPublicSpecialistById,
  getPublicSpecialists,
  gePublicServices,
  gePublicActiveEvents,
  getPublicActiveEventById,
} from "../controllers/publicDetails.controller.js";

const router = express.Router();

router.get("/specialists", getPublicSpecialists);
router.get("/specialists/:id", getPublicSpecialistById);
router.get("/products", getPublicProducts);
router.get("/products_with_limits", getPublicProductsWithLimits);
router.get("/products/:id", getPublicProductById);
router.get("/services", gePublicServices);
router.get("/active-events", gePublicActiveEvents);
router.get("/active-events/:id", getPublicActiveEventById);

export default router;
