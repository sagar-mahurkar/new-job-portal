import { Router } from "express";
import { RecruiterController } from "@/modules/recruiter/recruiter.controller";
import { verifyJwt } from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/role.middleware";
import { recruiterDashboardRouter } from "@/modules/recruiter-dashboard/recruiter-dashboard.routes";

const router = Router();

router.use(verifyJwt, requireRole("RECRUITER"));

// get profile
router.get("/me", RecruiterController.getMe);

// update profile
router.patch("/me", RecruiterController.updateMe);

// get all applications
router.get("/jobs/:id/applications", RecruiterController.getApplicationsByJob)

// update application status
router.patch("/applications/:id/status", RecruiterController.updateApplicationStatus)

// update job status
router.patch("/jobs/:id/status", RecruiterController.updateJobStatus)

router.use("/dashboard", recruiterDashboardRouter);

export default router;
