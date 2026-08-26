import { Request, Response, NextFunction } from "express";
import { sendSuccessResponse } from "@/common/utils/response.util";
import { HttpStatusCodes } from "@/common/constants/http.codes";
import { RecruiterDashboardService } from "./recruiter-dashboard.service";
import { mapRecruiterJobDashboardResponse, mapRecruiterOverviewResponse, mapRecentApplicationResponse } from "./recruiter-dashobard.response";
import { queryDashboardSchema } from "./query-recruiter-dashboard.dto";

export class RecruiterDashboardController {
  private static recruiterDashboardService = new RecruiterDashboardService();

  static async getRecruiterOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const overview = await RecruiterDashboardController.recruiterDashboardService.getRecruiterOverview(req.user!.id);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        mapRecruiterOverviewResponse(
          overview.jobStats, 
          overview.appStats
        ),
        "Overview fetched successfully"
      )
    } catch (err) {
      next(err);
    }
  }

  static async getRecruiterDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const params = queryDashboardSchema.parse(req.query);
      const result = await RecruiterDashboardController.recruiterDashboardService.getRecruiterDashboard(req.user!.id, params)
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        {
          data: result.rows.map(mapRecruiterJobDashboardResponse),
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

  static async getRecentApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const recruiterId = req.user!.id;

      const applications = await RecruiterDashboardController.recruiterDashboardService.getRecentApplications(recruiterId, 5);

      sendSuccessResponse(
        res, 
        HttpStatusCodes.OK, 
        {
          data: applications.map(mapRecentApplicationResponse),
        }
      );
    } catch (err) {
      next(err);
    }
  }
}
