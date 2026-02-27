import { Router } from "express";
import { RecruiterController } from "@/modules/recruiter/recruiter.controller";
import { verifyJwt } from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/role.middleware";

const router = Router();

router.use(verifyJwt, requireRole("RECRUITER"));

// get profile
router.get("/me", RecruiterController.getMe);

// update profile
router.patch("/me", RecruiterController.updateMe);

// get all applications
router.get("/job/:id/applications", RecruiterController.getApplicationsByJob)

// update application status
router.patch("/application/:id/status", RecruiterController.updateApplicationStatus)

export default router;
