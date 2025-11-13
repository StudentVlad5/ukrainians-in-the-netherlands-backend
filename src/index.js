import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import logger from "morgan";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js";

dotenv.config();

// --- Express ---
const app = express();
const status = process.env.STATUS || "development";
app.use(logger(status === "development" ? "dev" : "short"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRouter);
app.use("/api", (req, res) => {
  console.log("!!!!! 404 Handler for API route !!!!!!");
  res.status(404).json({ messages: "API route not found" });
});

// --- MongoDB Connection ---
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// --- Serverless Handler для Vercel ---
export default async function handler(req, res) {
  await connectDB(); // підключаємо DB
  app(req, res); // Express обробляє запит
}

if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 4000;
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
