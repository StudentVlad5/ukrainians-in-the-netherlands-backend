import express from "express";
import {
  createNews,
  getAllNews,
  deleteNews,
  updateNews,
  getNewsBySlugOrId,
} from "../controllers/news.controller.js";
import { uploadNews } from "../middlewares/uploadMiddleware.js";
import { requireRole, verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getAllNews);
router.get("/:idOrSlug", getNewsBySlugOrId);
router.post(
  "/",
  verifyToken,
  requireRole(["admin"]),
  uploadNews.single("image"),
  createNews
);
router.put(
  "/:id",
  verifyToken,
  requireRole(["admin"]),
  uploadNews.single("image"),
  updateNews
);
router.delete("/:id", verifyToken, requireRole(["admin"]), deleteNews);

export default router;
