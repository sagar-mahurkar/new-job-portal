import { Router } from "express";
import { UserController } from "@/modules/user/user.controller";
import { verifyJwt } from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/role.middleware";

const router = Router();

// get user
router.get("/me", verifyJwt, requireRole("CANDIDATE", "RECRUITER"), UserController.getMe)

// update user details
router.patch("/me", verifyJwt, requireRole("CANDIDATE", "RECRUITER"), UserController.updateMe);

// delete user -> soft delete -> isActive -> false
router.delete("/me", verifyJwt, requireRole("CANDIDATE", "RECRUITER"), UserController.deactivateMe);

export default router;
