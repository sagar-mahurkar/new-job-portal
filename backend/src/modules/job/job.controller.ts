import { Request, Response, NextFunction } from "express";
import { JobService } from "./job.service";
import { createJobSchema, getMyJobsSchema, jobIdParamSchema, updateJobSchema } from "./dtos";
import { sendSuccessResponse } from "@/common/utils/response.util";
import { HttpStatusCodes } from "@/common/constants/http.codes";
import { mapJobToResponse } from "./job.response";

export class JobController {

  private static jobService = new JobService();

  static async createJob(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = createJobSchema.parse(req.body);
      const job = await JobController.jobService.createJob(req.user.id, dto);
      sendSuccessResponse(
        res,
        HttpStatusCodes.CREATED,
        mapJobToResponse(job),
        "Job created successfully"
      );
    } catch (err) {
      next(err)
    }
  }

  static async getMyJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = getMyJobsSchema.parse(req.params);
      const jobs = await JobController.jobService.getMyJobs(req.user.id, dto);
      sendSuccessResponse(
        res, 
        HttpStatusCodes.OK,
        jobs.map(mapJobToResponse),
        "Jobs fetched successfully"
      )
    } catch (err) {
      next(err)
    }
  }

  static async getJobById(req: Request, res: Response, next: NextFunction) {
    try {
      const params = jobIdParamSchema.parse(req.params)
      const job = await JobController.jobService.getJobById(req.user.id, params.id);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        mapJobToResponse(job),
        "Job fetched successfully"
      )
    } catch (err) {
      next(err)
    }
  }

  static async updateJob(req: Request, res: Response, next: NextFunction) {
    try {
      const params = jobIdParamSchema.parse(req.params);
      const dto = updateJobSchema.parse(req.body);
      const job = await JobController.jobService.updateJob(req.user.id, params.id, dto);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        mapJobToResponse(job),
        "Job updated successfully"
      )
    } catch (err) {
      next(err)
    }
  }

  static async deleteJob(req: Request, res: Response, next: NextFunction) {
    try {
      const params = jobIdParamSchema.parse(req.params);
      await JobController.jobService.deleteJob(req.user.id, params.id);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        null,
        "Job deleted successfully"
      )
    } catch (err) {
      next(err)
    }
  }
}