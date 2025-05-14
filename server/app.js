import express from "express";
import cors from "cors";
import morgan from "morgan";
import logger from "pino-http";
import { createStream } from "rotating-file-stream";
import db from "./db_driver";
import { router as authRoutes } from "./controllers/auth/index.js";
import { router as organizationAuthRoutes } from "./controllers/auth/organization.js"; // Import organization auth routes
import { router as adminRoutes } from "./controllers/admin/index.js";
import { router as marketplaceRoutes } from "./controllers/marketplace/index.js";
import { createSwapRequest, getAllSwapRequests, getSwapRequestById, updateSwapRequestById, deleteSwapRequestById, placeRequest,getSentSwapRequests } from './controllers/swap_request.js';
import { verifyToken } from "./controllers/auth/index.js";
import notificationRoutes from "./controllers/notifications.js";
import { submitContactForm, getAllContactForms, getContactFormById, deleteContactForm } from './controllers/contact.js';
import categoryRoutes from './controllers/category.js'; // Import category routes
import organizationRoutes from './controllers/organization/index.js'; // Import organization routes
import path from "path";

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

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get("/", (req, res, next) => {
  res.send("Express API server. You may be looking for the client at <a href='"+import.meta.env.VITE_CLIENT_URL+"'>"+import.meta.env.VITE_CLIENT_URL+"</a>");
});

// Use authentication routes
app.use("/api/auth", authRoutes);

// Use organization authentication routes
app.use("/api/organizations", organizationAuthRoutes);
// Use organization routes
app.use("/api/organizations",organizationRoutes)

// Use admin routes
app.use("/api/admin", adminRoutes);

// Use marketplace routes
app.use("/api/marketplace", marketplaceRoutes);

// Use notification routes
app.use("/api/notifications", notificationRoutes);//I have also removed prefix on notificationRoutes
 
// Use category routes
app.use("/api/categories", categoryRoutes); // Route category routes

// Swap Request routes
app.post('/api/swap-requests', createSwapRequest);
app.get('/api/swap-requests', getAllSwapRequests);
app.get('/api/swap-requests/:id', getSwapRequestById);
app.put('/api/swap-requests/:id', verifyToken, updateSwapRequestById);
app.delete('/api/swap-requests/:id', verifyToken, deleteSwapRequestById);
app.post('/api/swap-requests/:id/place-request', verifyToken, placeRequest);
app.get('/api/sent-swap-requests', verifyToken, getSentSwapRequests);

// Add profile update routes (already added above)
// app.post("/api/auth/update-profile", authRoutes);
// app.post("/api/auth/update-technical", authRoutes);

// Contact form routes
app.post(
  '/api/contact',
  submitContactForm
);
app.get('/api/contact', verifyToken, getAllContactForms);
app.get('/api/contact/:id', verifyToken, getContactFormById);
app.delete('/api/contact/:id', verifyToken, deleteContactForm);

if (import.meta.env.PROD) app.listen(import.meta.env.VITE_PORT || 4054);
