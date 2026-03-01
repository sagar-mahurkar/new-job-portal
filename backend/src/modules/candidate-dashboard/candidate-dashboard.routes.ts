import { Router } from "express";
import { verifyJwt } from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/role.middleware";
import { CandidateDashboardController } from "@/modules/candidate-dashboard/candidate-dashboard.controller"

const router = Router();

router.use(verifyJwt, requireRole("CANDIDATE"));

router.get("/", CandidateDashboardController.getCandidateDashboardSummary)

router.get("/applications", CandidateDashboardController.getCandidateDashboardApplications)

export { router as candidateDashboardRouter };
