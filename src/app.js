import express from "express";
import cors from "cors";
import logger  from "morgan";
import authRoutes from "./routes/auth.routes.js";

const status = process.env.STATUS || "development";
const formatsLogger = status === "development" ? "dev" : "short";
const app = express();

app.use(logger(formatsLogger));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());


app.get("/", (_, res) => res.send("API is running"));

app.use("/api/auth", authRoutes);


export default app;
