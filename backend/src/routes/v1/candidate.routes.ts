import { Router } from "express";
import { CandidateController } from "@/modules/candidate/candidate.controller";
import { verifyJwt } from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/role.middleware";

const router = Router();

// get profile
router.get("/me", verifyJwt, requireRole("CANDIDATE"), CandidateController.getMyProfile);

// update profile
router.patch("/me", verifyJwt, requireRole("CANDIDATE"), CandidateController.updateMyProfile);

export default router;
