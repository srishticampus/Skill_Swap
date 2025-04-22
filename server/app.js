import express from "express";
import cors from "cors";
import morgan from "morgan";
import logger from "pino-http";
import { createStream } from "rotating-file-stream";
import db from "./db_driver";
import { router as authRoutes } from "./controllers/auth/index.js";
import { router as adminRoutes } from "./controllers/admin/index.js";

export const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(logger());
app.use(express.json()); // Add this line to parse JSON request bodies

// create a rotating write stream
const accessLogStream = createStream("access.log", {
  interval: "1d", // rotate daily
  path: "./logs",
});

// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

app.get("/", (req, res, next) => {
  res.send("Expresssss");
});

// Use authentication routes
app.use("/api/auth", authRoutes);

// Use admin routes
app.use("/api/admin", adminRoutes);

if (import.meta.env.PROD) app.listen(3000);
