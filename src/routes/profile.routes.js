import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import uploadCloud from "../middlewares/uploadMiddleware.js";
import {
  getMyProfile,
  updateMyProfile,
  uploadAvatar,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/user", verifyToken, getMyProfile);
router.put("/user", verifyToken, updateMyProfile);
router.post("/avatar", verifyToken, uploadCloud.single("avatar"), uploadAvatar);

export default router;
