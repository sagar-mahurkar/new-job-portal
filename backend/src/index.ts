import { initDB } from "./loaders/db.loader";
import { logger } from "./config/logger.config";
import { MailTransporter } from "./config/mail.config";
import { env } from "./config/env.config";
import app from "./app"



// Server bootstrap
const startServer = async () => {
  try {
    await initDB();

    await MailTransporter.getInstance().init();
    
    const PORT = env.PORT;

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
