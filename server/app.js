import express from "express";
import cors from "cors";
import morgan from "morgan";
import logger from "pino-http";
import { createStream } from "rotating-file-stream";
import db from "./db_driver";
export const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(logger());

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

app.get("/pets", (req, res, next) => {
  res.send("Pets");
});

app.get("/pets/:id", (req, res, next) => {
  res.send("Pets");
});

if (import.meta.env.PROD) app.listen(3000);
