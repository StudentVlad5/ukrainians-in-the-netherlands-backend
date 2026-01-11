import express from "express";
const router = express.Router();
import {
  getAllTestimonials,
  createTestimonial,
} from "../controllers/testimonial.controller.js";

router.get("/", getAllTestimonials);
router.post("/", createTestimonial);

export default router;
