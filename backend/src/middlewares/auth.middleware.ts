import { HttpStatusCodes } from "@/common/constants/http.codes";
import { AppError } from "@/common/errors/AppError";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken"; 
import { env } from "@/config/env.config";
import { userRepository } from "@/modules/user/user.repository";
import { logger } from "@/config/logger.config";

export const verifyJwt = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // 1. Read Authorization header -> throw 401 if missing
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("Authentication header missing");
    return next(new AppError("Unauthorized", HttpStatusCodes.UNAUTHORIZED));
  }

  // 2. Extract the token from header -> `Bearer <token>`
  const [, token] = authHeader.split(" ");
  if (!token) {
    logger.warn("JWT missing");
    return next(new AppError("Unauthorized", HttpStatusCodes.UNAUTHORIZED));
  }

  try {
    // 3. Verify the token
    const decodedPayload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // 4. Extract `sub` and `role`
    const { sub, role } = decodedPayload;
    if (!sub || !role) {
      logger.warn("Id or role is invalid");
      return next(new AppError("Unauthorized", HttpStatusCodes.UNAUTHORIZED));
    }

    // 5. Check if the user exists
    const user = await userRepository.findOne({
      where: {id: sub}
    });

    if (!user || !user.isActive) {
      logger.warn("User not found or deactivated");
      return next(new AppError("Unauthorized", HttpStatusCodes.UNAUTHORIZED));
    }

    // 6. Attach normalized user to request object
    req.user = {
      id: user.id,
      role: user.role
    };

    // 7. Continue request lifecycle
    next();
  } catch {
    return next(new AppError("Unauthorized", HttpStatusCodes.UNAUTHORIZED));
  }
};

// Implement JWT Authentication Middleware
// Define Authenticated User Type
// Protect Routes Using Auth Middleware