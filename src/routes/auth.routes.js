import express from "express";
import { register, login, getProfile } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/profile
router.get("/profile", verifyToken, getProfile);

export default router;
