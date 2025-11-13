import express from "express";
import path from "path";
import { fileURLToPath } from "url";
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
  res.status(404); // .json({ message: "Not found", data: null });
  res.json({ messages: "ERRR JSONS" });
});

// --- Виправлення для __dirname в ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ------------------------------------
// Використовуйте стандартну змінну Node.js для визначення режиму
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  app.use(express.static(path.join(__dirname, "./client/build")));
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
}

export default app;
