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
export class AuthController {
  constructor() {
    this.signupRecruiter = this.signupRecruiter.bind(this);
    this.signupCandidate = this.signupCandidate.bind(this);
    this.loginWithPassword = this.loginWithPassword.bind(this);
    this.requestLoginOtp = this.requestLoginOtp.bind(this);
    this.resendLoginOtp = this.resendLoginOtp.bind(this);
    this.loginWithOtp = this.loginWithOtp.bind(this);
  }

  private readonly authService = new AuthService();
  // TODO: signupRecruiter()
  async signupRecruiter(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = signupRecruiterSchema.parse(req.body);
      const result = await this.authService.signupRecruiter(dto);
      sendSuccessResponse(
        res,
        HttpStatusCodes.CREATED,
        result,
        "Recruiter created successfully"
      )
    } catch (err) {
      next(err);
    }
  }

  // TODO: signupCandidate()
    async signupCandidate(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = signupCandidateSchema.parse(req.body);
      const result = await this.authService.signupCandidate(dto);
      sendSuccessResponse(
        res,
        HttpStatusCodes.CREATED,
        result,
        "Candidate created successfully"
      )
    } catch (err) {
      next(err);
    }
  }

  // TODO: loginWithPassword()
  async loginWithPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = loginPasswordSchema.parse(req.body);
      const result = await this.authService.loginWithPassword(dto);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        result,
        "User logged in successfully"
      )
    } catch (err) {
      next(err);
    }
  }

  // TODO: requestLoginOtp()
  async requestLoginOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = requestOtpSchema.parse(req.body);
      const result = await this.authService.requestLoginOtp(dto);
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
  async resendLoginOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = requestOtpSchema.parse(req.body);
      const result = await this.authService.resendLoginOtp(dto);
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
  async loginWithOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = loginOtpSchema.parse(req.body);
      const result = await this.authService.loginWithOtp(dto);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        result,
        "User logged in successfully"
      )
    } catch (err) {
      next(err);
    }
  }
}
