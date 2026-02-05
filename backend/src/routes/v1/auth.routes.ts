import { Router } from "express";
import { AuthController } from "@/modules/auth/auth.controller";

const router = Router();

// signup
router.post("/signup/recruiter", AuthController.signupRecruiter);
router.post("/signup/candidate", AuthController.signupCandidate);

// login (password)
router.post("/login/password", AuthController.loginWithPassword);

// login (otp)
router.post("/login/otp/request", AuthController.requestLoginOtp);
router.post("/login/otp/resend", AuthController.resendLoginOtp);
router.post("/login/otp/verify", AuthController.loginWithOtp);

// sanity check
router.get("/ping", (_req, res) => {
  res.json({ ok: true });
});

export default router;
