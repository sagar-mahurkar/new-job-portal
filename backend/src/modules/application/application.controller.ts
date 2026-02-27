import { Request, Response, NextFunction } from "express";
import { ApplicationService } from "./application.service";
import { createApplicationSchema } from "./dtos/create-application.dto";
import { sendSuccessResponse } from "@/common/utils/response.util";
import { HttpStatusCodes } from "@/common/constants/http.codes";
import { mapApplicationToCandidateResponse, mapApplicationToRecruiterResponse } from "./application.response";

export class ApplicationController {
  private static applicationService = new ApplicationService();

  static async applyForJob(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = createApplicationSchema.parse(req.body);
      const application = await ApplicationController.applicationService.applyForJob(req.user.id, dto);
      sendSuccessResponse(
        res,
        HttpStatusCodes.CREATED,
        mapApplicationToCandidateResponse(application),
        "Application created successfully"
      )
    } catch (err) {
      next(err)
    }
  }

  static async getAllApplicationsByCandidate(req: Request, res: Response, next: NextFunction) {
    try {
      const applications = await ApplicationController.applicationService.getAllApplicationsByCandidate(req.user.id);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        applications.map(mapApplicationToCandidateResponse),
        "Applications fetched successfully"
      )
    } catch (err) {
      next(err)
    }
  }
}