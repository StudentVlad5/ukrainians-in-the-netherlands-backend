import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { uploadAvatar } from "../middlewares/uploadMiddleware.js";
import {
  getMyProfile,
  updateMyProfile,
  uplAvatar,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/user", verifyToken, getMyProfile);
router.put("/user", verifyToken, updateMyProfile);
router.post("/avatar", verifyToken, uploadAvatar.single("avatar"), uplAvatar);

export default router;
