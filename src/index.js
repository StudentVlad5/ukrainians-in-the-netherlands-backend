import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import logger from "morgan";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js";
import productsRouter from "./routes/products.routes.js";
import specialistRoutes from "./routes/specialist.routes.js";
import newsRoutes from "./routes/news.routes.js";
import eventsRouter from "./routes/events.routes.js";
import activeEventsRouter from "./routes/activeEvents.routes.js";
import categoriesRouter from "./routes/categories.routes.js";
import publicsRouter from "./routes/publicDetails.routes.js";

dotenv.config();

// --- Express ---
const app = express();
const status = process.env.STATUS || "development";
app.use(logger(status === "development" ? "dev" : "short"));
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://ukrainians-in-the-netherlands-front.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRouter);

app.use("/api/products", productsRouter);
app.use("/api/specialists", specialistRoutes);
app.use("/api/news", newsRoutes);

app.use("/api/events", eventsRouter);
app.use("/api/active-events", activeEventsRouter);
// app.use("/api/orders", ordersRouter);
app.use("/api/categories", categoriesRouter);

app.use("/api/public", publicsRouter);
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

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DB Connection Middleware Error:", error);
    res.status(500).json({ message: "Database connection failed" });
  }
});

// 2. Для локальної розробки (коли ми НЕ на Vercel)
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 4000;
  // Ми запускаємо `connectDB` один раз при старті
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(
          `✅ DB connected. 🚀 Server running on http://localhost:${PORT}`
        );
      });
    })
    .catch((err) => {
      console.error("Failed to start local server:", err);
    });
}

// 3. Експортуємо сам 'app' для Vercel.
//    Vercel сам оберне це в правильний serverless handler.
export default app;
