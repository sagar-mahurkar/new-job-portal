import { Request, Response, NextFunction } from "express";
import { JobService } from "./job.service";
import { createJobSchema, getMyJobsSchema, getJobByIdSchema } from "./dtos";
import { sendSuccessResponse } from "@/common/utils/response.util";
import { HttpStatusCodes } from "@/common/constants/http.codes";

export class JobController {

  private static jobService = new JobService();

  static async createJob(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = createJobSchema.parse(req.body);
      const result = await JobController.jobService.createJob(req.user.id, dto);
      sendSuccessResponse(
        res,
        HttpStatusCodes.CREATED,
        result,
        "Job created successfully"
      );
    } catch (err) {
      next(err)
    }
  }

  static async getMyJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = getMyJobsSchema.parse(req.params);
      const result = await JobController.jobService.getMyJobs(req.user.id, dto);
      sendSuccessResponse(
        res, 
        HttpStatusCodes.OK,
        result,
        "Jobs fetched successfully"
      )
    } catch (err) {
      next(err)
    }
  }

  static async getJobById(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = getJobByIdSchema.parse(req.params);
      const result = await JobController.jobService.getJobById(req.user.id, dto);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        result,
        "Job fetched successfully"
      )
    } catch (err) {
      next(err)
    }
  }
}