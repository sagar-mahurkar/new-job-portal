import { Router } from "express";
import { ApplicationController } from "@/modules/application/application.controller";
import { verifyJwt } from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/role.middleware";

const router = Router()

// Apply to ALL routes below
router.use(verifyJwt, requireRole("RECRUITER"));

// create application
router.post("/apply", ApplicationController.apply);

// get all applications
router.get("/me", ApplicationController.getAllApplicationsByCandidate);

export default router;
