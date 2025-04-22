import express from "express";
import cors from "cors";
import morgan from "morgan";
import logger from "pino-http";
import { createStream } from "rotating-file-stream";
import db from "./db_driver";
import { router as authRoutes } from "./controllers/auth/index.js";
import { router as adminRoutes } from "./controllers/admin/index.js";
import { router as marketplaceRoutes } from "./controllers/marketplace/index.js";
import { createSwapRequest, getAllSwapRequests, getSwapRequestById, updateSwapRequestById, deleteSwapRequestById } from './controllers/swap_request.js';
import { verifyToken } from "./controllers/auth/index.js";

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

// Use marketplace routes
app.use("/api/marketplace", marketplaceRoutes);

// Swap Request routes
app.post('/api/swap-requests', createSwapRequest);
app.get('/api/swap-requests', getAllSwapRequests);
app.get('/api/swap-requests/:id', getSwapRequestById);
app.put('/api/swap-requests/:id', verifyToken, updateSwapRequestById);
app.delete('/api/swap-requests/:id', verifyToken, deleteSwapRequestById);

// Add profile update routes
app.post("/api/auth/update-profile", authRoutes);
app.post("/api/auth/update-technical", authRoutes);

if (import.meta.env.PROD) app.listen(3000);
