import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware";
import authRoutes from "@/routes/v1/auth.routes";
import jobRoutes from "@/routes/v1/job.routes";
import userRoutes from "@/routes/v1/user.routes";
import candidateRoutes from "@/routes/v1/candidate.routes";
import recruiterRoutes from "@/routes/v1/recruiter.routes";
import { HttpStatusCodes } from "./common/constants/http.codes";
import { requestLogger } from "./middlewares/requestLogger.middleware";
import { JobPortalDataSource } from "./config/database.config";
import { logger } from "./config/logger.config";
import { AppError } from "@/common/errors/AppError"

// Express app initialization
const app = express();

// Core security middlewares (helmet, CORS)
app.use(cors());

// Request logging middleware
app.use(requestLogger);

// Body parsers (express.json, urlencoded)
app.use(express.json({ limit: "10kb" }));

// Request size limit configuration

// Content-Type enforcement middleware
app.use((req, _res, next) => {
  if (req.method !== "GET" && !req.is("application/json")) {
    return next(
      new AppError(
        "Unsupported Media Type",
        HttpStatusCodes.UNSUPPORTED_MEDIA_TYPE
      )
    );
  }
  next();
});


// Health route (NO DB QUERY)
app.get("/health", (_req, res) => {
  logger.info("Health check")
  return res.status(HttpStatusCodes.OK).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: JobPortalDataSource.isInitialized ? "connected" : "not_connected",
  });
});

// Route mounting
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/candidates", candidateRoutes);
app.use("/api/v1/recruiters", recruiterRoutes);

// 404 Not Found handler
app.use((req, _res, next) => {
  next(
    new AppError(
      `Route ${req.method} ${req.originalUrl} not found`,
      HttpStatusCodes.NOT_FOUND
    )
  );
});

// Global error handling middleware
app.use(errorMiddleware);

// Export configured app
export default app;