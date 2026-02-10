import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { HttpStatusCodes } from "@/common/constants/http.codes";
import { 
  loginOtpSchema, 
  loginPasswordSchema, 
  requestOtpSchema, 
  signupCandidateSchema, 
  signupRecruiterSchema 
} from "./dtos"
import { sendSuccessResponse } from "@/common/utils/response.util";
import { mapUserToResponse } from "../user/user.response";
export class AuthController {

  private static authService = new AuthService();
  // TODO: signupRecruiter()
  static async signupRecruiter(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = signupRecruiterSchema.parse(req.body);
      const result = await AuthController.authService.signupRecruiter(dto);
      sendSuccessResponse(
        res,
        HttpStatusCodes.CREATED,
        [mapUserToResponse(result.user), result.token],
        "Recruiter created successfully"
      )
    } catch (err) {
      next(err);
    }
  }

  // TODO: signupCandidate()
  static async signupCandidate(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = signupCandidateSchema.parse(req.body);
      const result = await AuthController.authService.signupCandidate(dto);
      sendSuccessResponse(
        res,
        HttpStatusCodes.CREATED,
        [mapUserToResponse(result.user), result.token],
        "Candidate created successfully"
      )
    } catch (err) {
      next(err);
    }
  }

  // TODO: loginWithPassword()
  static async loginWithPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = loginPasswordSchema.parse(req.body);
      const result = await AuthController.authService.loginWithPassword(dto);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        [mapUserToResponse(result.user), result.token],
        "User logged in successfully"
      )
    } catch (err) {
      next(err);
    }
  }

  // TODO: requestLoginOtp()
  static async requestLoginOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = requestOtpSchema.parse(req.body);
      await AuthController.authService.requestLoginOtp(dto);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        null,
        "OTP sent successfully"
      )
    } catch (err) {
      next(err);
    }
  }

  // TODO: resendLoginOtp()
  static async resendLoginOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = requestOtpSchema.parse(req.body);
      await AuthController.authService.resendLoginOtp(dto);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        null,
        "OTP sent successfully"
      )
    } catch (err) {
      next(err);
    }
  }

  // TODO: loginWithOtp()
  static async loginWithOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = loginOtpSchema.parse(req.body);
      const result = await AuthController.authService.loginWithOtp(dto);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        [mapUserToResponse(result.user), result.token],
        "User logged in successfully"
      )
    } catch (err) {
      next(err);
    }
  }
}
