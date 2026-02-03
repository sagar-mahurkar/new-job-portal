import { JobPortalDataSource } from "../config/database.config";
import { logger } from "../config/logger.config";

export const initDB = async (): Promise<void> => {
  try {
    if (!JobPortalDataSource.isInitialized) {
      await JobPortalDataSource.initialize();
      logger.info("Database connected");
    } else {
      logger.warn("Database already initialized");
    }
  } catch (error) {
    logger.error("Database connection failed", error);
    process.exit(1);
  }
};
