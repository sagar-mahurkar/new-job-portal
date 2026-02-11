import { Router } from "express";
import { JobController } from "@/modules/job/job.controller";
import { verifyJwt } from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/role.middleware";

const router = Router()

// Apply to ALL routes below
router.use(verifyJwt, requireRole("RECRUITER"));

// create job
router.post("/", JobController.createJob);

// get my jobs
router.get("/me", JobController.getMyJobs);

// get job by id
router.get("/:id", JobController.getJobById);

// update job by id
router.patch("/:id", JobController.updateJob);

// delete job by id
router.delete("/:id", JobController.deleteJob);

export default router;
