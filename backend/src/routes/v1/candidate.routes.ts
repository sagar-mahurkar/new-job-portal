import { Router } from "express";
import { CandidateController } from "@/modules/candidate/candidate.controller";
import { verifyJwt } from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/role.middleware";

const router = Router();

router.use(verifyJwt, requireRole("CANDIDATE"));

// get profile
router.get("/me", CandidateController.getMe);

// update profile
router.patch("/me", CandidateController.updateMe);

export default router;
