import { Request, Response, NextFunction } from "express";
import { RecruiterService } from "./recruiter.service";
import { sendSuccessResponse } from "@/common/utils/response.util";
import { HttpStatusCodes } from "@/common/constants/http.codes";
import { mapRecruiterToResponse } from "./recruiter.response";
import { updateRecruiterProfileSchema } from "./recruiter.dto";
import { AppError } from "@/common/errors/AppError"
export class RecruiterController {

  private static recruiterService = new RecruiterService();

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const recruiter = await RecruiterController.recruiterService.getMe(req.user.id);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        mapRecruiterToResponse(recruiter),
        "Recruiter profile fetched successfully"
      )
    } catch (err) {
      next(err)
    }
  }

  static async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = updateRecruiterProfileSchema.parse(req.body);
      if (Object.keys(dto).length === 0) {
        throw new AppError(
          "At least one field must be provided for update",
          HttpStatusCodes.BAD_REQUEST
        );
      }
      const recruiter = await RecruiterController.recruiterService.updateMe(req.user.id, dto);
      sendSuccessResponse(
        res, 
        HttpStatusCodes.OK,
        mapRecruiterToResponse(recruiter),
        "Recruiter profile updated successfully"
      );
    } catch (err) {
      next(err);
    }
  }

  // soft delete -> user controllers
}