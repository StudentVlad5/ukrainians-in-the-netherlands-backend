import express from "express";
import {
  createNews,
  getAllNews,
  deleteNews,
} from "../controllers/news.controller.js";
import { uploadNews } from "../middlewares/uploadMiddleware.js";
import { requireRole, verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, requireRole(["admin"]), getAllNews);
router.post(
  "/",
  verifyToken,
  requireRole(["admin"]),
  uploadNews.single("image"),
  createNews
);
router.delete("/:id", verifyToken, requireRole(["admin"]), deleteNews);

export default router;
