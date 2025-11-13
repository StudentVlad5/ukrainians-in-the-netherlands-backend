import express from "express";
import cors from "cors";
import logger from "morgan";
import authRoutes from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js";

const status = process.env.STATUS || "development";
const formatsLogger = status === "development" ? "dev" : "short";
const app = express();

app.use(logger(formatsLogger));
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "https://ukrainians-in-the-netherlands-front.vercel.app/",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (_, res) => res.send("API is running"));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRouter);

export default app;
