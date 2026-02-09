import { Request, Response, NextFunction } from "express";
import { AppError } from "@/common/errors/AppError";
import { logger } from "@/config/logger.config";
import { ZodError } from "zod";
import { HttpStatusCodes } from "@/common/constants/http.codes";
import { QueryFailedError } from "typeorm";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Zod validation errors
  if (err instanceof ZodError) {
    logger.warn("Validation error", {
      statusCode: HttpStatusCodes.BAD_REQUEST,
      path: req.originalUrl,
      method: req.method,
      errors: err.issues      
    });

    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map(e => ({
        field: e.path.join("."),
        message: e.message
      }))
    })
  }

  // 2. Operational errors (expected)
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

  // 3. Postgres Errors (unexpected)
  if (err instanceof QueryFailedError) {
    logger.error("Database error", {
      message: err.message,
      query: err.query,
    });

    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Database operation failed",
    });
  }


  // 4. Unknown / programmer / system errors
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
