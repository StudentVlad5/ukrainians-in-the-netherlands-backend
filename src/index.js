import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import mongoose from "mongoose";

dotenv.config();

// --- Виправлення для __dirname в ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ------------------------------------

// Отримуємо змінні середовища
const PORT = process.env.PORT || 3030;
const mongoUri = process.env.MONGODB_URI;

// Використовуйте стандартну змінну Node.js для визначення режиму
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  app.use(express.static(path.join(__dirname, "./client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
}

const connectDB = async () => {
  if (!mongoUri) {
    console.error("Помилка: MONGO_URI не визначено в .env файлі");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri, {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("✅ Database connection successful");
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
