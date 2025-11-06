import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import listingsRoutes from "./routes/listings.routes.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.get("/", (_, res) => res.send("API is running"));

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingsRoutes);

export default app;
