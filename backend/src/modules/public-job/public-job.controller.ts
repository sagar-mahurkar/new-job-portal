import { Request, Response, NextFunction } from "express";
import { PublicJobService } from "./public-job.service";
import { jobIdParamSchema, listPublicJobsSchema } from "./dtos"
import { sendSuccessResponse } from "@/common/utils/response.util";
import { HttpStatusCodes } from "@/common/constants/http.codes";
import { mapPublicJobResponse } from "./public-job.response";


export class PublicJobController {
  private static publicJobService = new PublicJobService();

  static async getOpenJobsWithFilters(req: Request, res: Response, next: NextFunction){
    try {
      const dto = listPublicJobsSchema.parse(req.query);
      const result = await PublicJobController.publicJobService.getOpenJobsWithFilters(dto);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        {
          data: result.rows.map(mapPublicJobResponse),
          meta: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
          }
        }
      )
    } catch (err) {
      next(err);
    }
  }

  static async getOpenJobById(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = jobIdParamSchema.parse(req.params);
      const result = await PublicJobController.publicJobService.getOpenJobById(dto);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        mapPublicJobResponse(result),
        "Job fetched successfully"
      )
    } catch (err) {
      next(err);
    }
  }


  static async getPublicJobFilters(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PublicJobController.publicJobService.getPublicJobFilters();
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        result,
        "Filters fetched successfully"
      )
    } catch (err) {
      next(err);
    }
  }
}