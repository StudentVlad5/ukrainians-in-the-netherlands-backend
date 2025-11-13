// index.js (повна заміна)

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import logger from "morgan";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js";

dotenv.config();

// --- 1. Налаштування Express (те, що було в app.js) ---
const app = express();
const status = process.env.STATUS || "development";
const formatsLogger = status === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- 2. Ваші API-роути ---
// Vercel направить сюди запити /api/...
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRouter);

// --- 3. Обробка 404 (Виправлена) ---
// Цей обробник відловить всі запити, що починаються з /api
// і не були оброблені роутами вище.
app.use("/api", (req, res) => {
  console.log("!!!!! 404 Handler for API route !!!!!!");
  res.status(404);
  res.json({ messages: "API route not found" });
});

// --- 4. Підключення до Бази Даних ---
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("Помилка: MONGODB_URI не визначено в .env файлі");
  // Це зупинить виконання, і Vercel покаже 500
  process.exit(1);
}

// Підключаємося до БД. Vercel буде кешувати це з'єднання.
mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- 5. Експорт для Vercel ---
// НЕ ВИКОРИСТОВУЙТЕ app.listen()
// Це найголовніший рядок для Vercel.
export default app;
