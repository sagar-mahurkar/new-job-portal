import { Router } from "express";
import { UserController } from "@/modules/user/user.controller";
import { verifyJwt } from "@/middlewares/auth.middleware";
import { requireRole } from "@/middlewares/role.middleware";

const router = Router();

// get user
router.get("/me", verifyJwt, requireRole("CANDIDATE", "RECRUITER"), UserController.getUser)

// update user details
router.patch("/me", verifyJwt, requireRole("CANDIDATE", "RECRUITER"), UserController.updateUser);

// delete user -> soft delete -> isActive -> false
router.delete("/me", verifyJwt, requireRole("CANDIDATE", "RECRUITER"), UserController.deactivateUser);

export default router;
