import express from "express";
import cors from "cors";
import logger from "morgan";
import authRoutes from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js";

const status = process.env.STATUS || "development";
const formatsLogger = status === "development" ? "dev" : "short";
const app = express();

app.use(logger(formatsLogger));
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRouter);

app.use((req, res) => {
  console.log("!!!!! START APP (req, res) !!!!!!");
  res.status(404);
  res.json({ messages: "ERRR JSONS" });
});

export default app;
