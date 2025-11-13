import dotenv from "dotenv";
import app from "./app.js";
import mongoose from "mongoose";

dotenv.config();

// Отримуємо змінні середовища
const PORT = process.env.PORT || 3030;
const mongoUri = process.env.MONGODB_URI;

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
