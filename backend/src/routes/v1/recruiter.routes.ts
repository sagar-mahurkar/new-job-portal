import { Router } from "express";
import { RecruiterController } from "@/modules/recruiter/recruiter.controller";
import { verifyJwt } from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/role.middleware";

const router = Router();

// get profile
router.get("/", verifyJwt, requireRole("RECRUITER"), RecruiterController.getMyProfile);

// update profile
router.patch("/", verifyJwt, requireRole("RECRUITER"), RecruiterController.updateMyProfile);

// delete profile
router.delete("/", verifyJwt, requireRole("RECRUITER"), RecruiterController.deleteMyProfile);

export default router;