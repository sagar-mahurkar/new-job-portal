import { Router } from "express";
import { RecruiterController } from "@/modules/recruiter/recruiter.controller";
import { verifyJwt } from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/role.middleware";

const router = Router();

// get profile
router.get("/me", verifyJwt, requireRole("RECRUITER"), RecruiterController.getMe);

// update profile
router.patch("/me", verifyJwt, requireRole("RECRUITER"), RecruiterController.updateMe);

export default router;
