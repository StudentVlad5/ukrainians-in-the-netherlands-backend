import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./config/db.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 4000;
console.log("🟢 Connecting to MongoDB URI:", process.env.MONGODB_URI);
mongoose.set("debug", true);
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));
});
