import { Router } from "express";
import { JobController } from "@/modules/job/job.controller";
import { verifyJwt } from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/role.middleware";

const router = Router()

// create job
router.post("/", verifyJwt, requireRole("recruiter"), JobController.createJob);

// get my jobs
router.get("/me", verifyJwt, requireRole("recruiter"), JobController.getMyJobs)

// get job by id
router.get("/:id", verifyJwt, requireRole("recruiter"), JobController.getJobById);

export default router;
