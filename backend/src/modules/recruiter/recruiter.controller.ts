import { Request, Response, NextFunction } from "express";
import { RecruiterService } from "./recruiter.service";
import { sendSuccessResponse } from "@/common/utils/response.util";
import { HttpStatusCodes } from "@/common/constants/http.codes";
import { mapRecruiterToResponse } from "./recruiter.response";
import { updateRecruiterProfileSchema, listJobApplicationsQuerySchema } from "./dtos";
import { AppError } from "@/common/errors/AppError"
import { mapApplicationToRecruiterResponse } from "@/modules/application/application.response";
import { updateApplicationStatusSchema, getApplicationSchema } from "@/modules/application/dtos";

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
      next(err);
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

  static async getApplicationsByJob(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = listJobApplicationsQuerySchema.parse({...req.params, ...req.query})
      const result = await RecruiterController.recruiterService.getApplicationsByJob(req.user.id, dto)
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        {
          data: result.data.map(mapApplicationToRecruiterResponse),
          meta: result.meta
        },
        "Applications fetched successfully"
      )
    } catch (err) {
      next(err);
    }
  }

  static async updateApplicationStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const params = getApplicationSchema.parse(req.params)
      const dto = updateApplicationStatusSchema.parse(req.body);
      const application = await RecruiterController.recruiterService.updateApplicationStatus(req.user.id, params.id, dto);
    sendSuccessResponse(
      res,
      HttpStatusCodes.OK,
      mapApplicationToRecruiterResponse(application),
      "Status updated successfully"
    )
    } catch (err) {
      next(err);
    }
  }
}