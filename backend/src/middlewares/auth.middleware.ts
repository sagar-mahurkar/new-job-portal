import { HttpStatusCodes } from "@/common/constants/http.codes";
import { AppError } from "@/common/errors/AppError";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken"; 
import { env } from "@/config/env.config";

export const verifyJwt = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // 1. Read Authorization header -> throw 401 if missing
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", HttpStatusCodes.UNAUTHORIZED));
  }

  // 2. Extract the token from header -> `Bearer <token>`
  const [, token] = authHeader.split(" ");
  if (!token) {
    return next(new AppError("Unauthorized", HttpStatusCodes.UNAUTHORIZED));
  }

  try {
    // 3. Verify the token
    const decodedPayload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // 4. Extract `sub` and `role`
    const { sub, role } = decodedPayload;
    if (!sub || !role) {
      return next(new AppError("Unauthorized", HttpStatusCodes.UNAUTHORIZED));
    }

    // 5. Attach normalized user to request object
    req.user = {
      id: sub as string,
      role
    };

    // 6. Continue request lifecycle
    next();
  } catch {
    return next(new AppError("Unauthorized", HttpStatusCodes.UNAUTHORIZED));
  }
};

// TODO: Implement JWT Authentication Middleware
// TODO: Define Authenticated User Type
// TODO: Protect Routes Using Auth Middleware