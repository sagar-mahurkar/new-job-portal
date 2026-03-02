import { Router } from "express";
import { PublicJobController } from "@/modules/public-job/public-job.controller";

const router = Router();

router.get("/", PublicJobController.getOpenJobsWithFilters);

router.get("/filters", PublicJobController.getPublicJobFilters);

router.get("/:id", PublicJobController.getOpenJobById);


export { router as publicJobRouter};
