import { Router } from "express";
import { CandidateController } from "@/modules/candidate/candidate.controller";
import { verifyJwt } from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/role.middleware";

const router = Router();

// get profile
router.get("/", verifyJwt, requireRole("CANDIDATE"), CandidateController.getMyProfile);

// update profile
router.patch("/", verifyJwt, requireRole("CANDIDATE"), CandidateController.updateMyProfile);

// delete profile
router.delete("/", verifyJwt, requireRole("CANDIDATE"), CandidateController.deleteMyProfile);

export default router;