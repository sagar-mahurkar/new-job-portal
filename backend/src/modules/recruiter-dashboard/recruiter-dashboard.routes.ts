import { Router } from "express";
import { verifyJwt } from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/role.middleware";
import { RecruiterDashboardController } from "@/modules/recruiter-dashboard/recruiter-dashboard.controller"

const router = Router();

router.use(verifyJwt, requireRole("RECRUITER"));

// get dashboard
router.get("/", RecruiterDashboardController.getRecruiterDashboard)

// get dashboard overview
router.get("/overview", RecruiterDashboardController.getRecruiterOverview)

export { router as recruiterDashboardRouter };
