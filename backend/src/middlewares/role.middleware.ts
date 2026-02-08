import { Request, Response, NextFunction } from "express";
import { AppError } from "@/common/errors/AppError";
import { HttpStatusCodes } from "@/common/constants/http.codes";

export const requireRole =
  (...allowedRoles: Array<'RECRUITER' | 'CANDIDATE'>) =>
  (req: Request, _res: Response, next: NextFunction) => {

    if (!req.user) {
      return next(
        new AppError("Unauthorized", HttpStatusCodes.UNAUTHORIZED)
      );
    };

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("Forbidden", HttpStatusCodes.FORBIDDEN)
      );
    };

    next();
  };

// () => () => {} -> Closure
// 1. requireRole("recruiter") is called
// 2. allowedRoles = ["recruiter"]
// 3. Outer function finishes execution
// 4. Inner function still remembers allowedRoles
// That memory is the closure.