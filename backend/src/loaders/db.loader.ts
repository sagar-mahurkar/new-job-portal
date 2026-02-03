import { JobPortalDataSource } from "../config/database.config";
import { logger } from "../config/logger.config";

export const initDB = async (): Promise<void> => {
  try {
    await JobPortalDataSource.initialize();
    logger.info("Database connected");
  } catch (error) {
    logger.error("Database connection failed", error);
    process.exit(1);
  }
};
