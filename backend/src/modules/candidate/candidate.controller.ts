import { Request, Response, NextFunction } from "express";
import { sendSuccessResponse } from "@/common/utils/response.util";
import { HttpStatusCodes } from "@/common/constants/http.codes";
import { mapCandidateToResponse } from "./candidate.response";
import { CandidateService } from "./candidate.service"
import { updateCandidateProfileSchema } from "./candidate.dto";
import { AppError } from "@/common/errors/AppError";
export class CandidateController {

  private static candidateService = new CandidateService();

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const candidate = await CandidateController.candidateService.getMe(req.user.id);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        mapCandidateToResponse(candidate),
        "Candidate profile fetched successfully"
      )
    } catch (err) {
      next(err)
    }
  }

  static async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = updateCandidateProfileSchema.parse(req.body);
      if (Object.keys(dto).length === 0) {
        throw new AppError(
          "At least one field must be provided for update",
          HttpStatusCodes.BAD_REQUEST
        );
      }
      const candidate = await CandidateController.candidateService.updateMe(req.user.id, dto);
      sendSuccessResponse(
        res, 
        HttpStatusCodes.OK,
        mapCandidateToResponse(candidate),
        "Candidate profile updated successfully"
      );
    } catch (err) {
      next(err);
    }
  }

  // soft delete -> user controller
}