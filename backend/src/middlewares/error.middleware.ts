import { Request, Response, NextFunction } from "express";
import { AppError } from "../common/errors/AppError";
import { logger } from "../config/logger.config";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Operational errors (expected)
  if (err instanceof AppError && err.isOperational) {
    logger.warn(err.message, {
      statusCode: err.statusCode,
      path: req.originalUrl,
      method: req.method,
    });

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unknown / programmer / system errors
  logger.error("Unhandled error", {
    error: err,
    path: req.originalUrl,
    method: req.method,
  });

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
