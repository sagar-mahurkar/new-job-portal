import { Router } from "express";
import { AuthController } from "@/modules/auth/auth.controller";

const router = Router();
const authController = new AuthController();

// signup
router.post("/signup/recruiter", authController.signupRecruiter);
router.post("/signup/candidate", authController.signupCandidate);

// login (password)
router.post("/login/password", authController.loginWithPassword);

// login (otp)
router.post("/login/otp/request", authController.requestLoginOtp);
router.post("/login/otp/resend", authController.resendLoginOtp);
router.post("/login/otp/verify", authController.loginWithOtp);

export default router;
