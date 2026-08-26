import { Request, Response, NextFunction } from "express";
import { sendSuccessResponse } from "@/common/utils/response.util";
import { HttpStatusCodes } from "@/common/constants/http.codes";
import { CandidateDashboardService } from "./candidate-dashboard.service";
import { mapCandidateDashboardSummaryResponse, mapCandidateDashboardApplicationsResponse } from "./candidate-dashobard.response";
import { queryDashboardSchema } from "./query-candidate-dashboard.dto";

export class CandidateDashboardController {
  private static candidateDashboardService = new CandidateDashboardService();

  static async getCandidateDashboardSummary(req: Request, res: Response, next: NextFunction){
    try {
      const result = await CandidateDashboardController.candidateDashboardService.getCandidateDashboardSummary(req.user!.id);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        mapCandidateDashboardSummaryResponse(result),
        "Dashboard summary fetched successfully"
      )
    } catch (err) {
      next(err);
    }
  }

  static async getCandidateDashboardApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = queryDashboardSchema.parse(req.query);
      const result = await CandidateDashboardController.candidateDashboardService.getCandidateDashboardApplications(req.user!.id, dto);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        {
          data: result.rows.map(mapCandidateDashboardApplicationsResponse),
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
}
