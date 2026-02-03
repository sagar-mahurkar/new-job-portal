import express from "express";
import cors from "cors";
import { logger } from "./config/logger.config";
import { initDB } from "./loaders/db.loader";
import { errorMiddleware } from "./middlewares/error.middleware";
import { JobPortalDataSource } from "./config/database.config";
import { HttpStatusCodes } from "./common/constants/http.codes";
import { env } from "./config/env.config";

// Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

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

// Error middleware (must be last)
app.use(errorMiddleware);

// Server bootstrap
const startServer = async () => {
  try {
    await initDB();

    const PORT = env.PORT || 8080;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
