import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import "./models/index.js";
import { contextMiddleware } from "./core/context/context.middleware.js";
import { BaseError } from "./core/errors/base-error.js";
import { ENV } from "./config/env.js";

import doctorsRoutes from "./modules/doctors/doctors.routes.js";
import walletRoutes from "./modules/wallet/wallet.routes.js";
import consultationsRoutes from "./modules/consultations/consultations.routes.js";
import messagesRoutes from "./modules/messages/messages.routes.js";

export const app = express();

// Middlewares
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(contextMiddleware);

// Health Check
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Rehmat Health Care API",
    location: "Malviya Nagar, Moradabad",
    time: new Date().toISOString(),
  });
});

// Mount Feature API Routes
app.use("/api/doctors", doctorsRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/consultations", consultationsRoutes);
app.use("/api/messages", messagesRoutes);

// Servercn Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.serializeErrors(),
      timestamp: new Date().toISOString(),
    });
  }

  console.error("Unhandled Error:", err);
  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: ENV.NODE_ENV === "production" ? "Internal server error" : err.message,
    timestamp: new Date().toISOString(),
  });
});

