import { Response, Request, NextFunction } from "express";
import { UserService } from "./user.service";
import { updateUserSchema } from "./user.dto";
import { sendSuccessResponse } from "@/common/utils/response.util";
import { HttpStatusCodes } from "@/common/constants/http.codes";
import { mapUserToResponse } from "./user.response";

export class UserController {

  private static userService = new UserService();

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserController.userService.getMe(req.user.id);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        mapUserToResponse(user),
        "User fetched successfully"
      )
    } catch (err) {
      next(err);
    }
  }

  static async updateMe(req: Request, res:Response, next: NextFunction) {
    try {
      const dto = updateUserSchema.parse(req.body);
      const user = await UserController.userService.updateMe(req.user.id, dto);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        mapUserToResponse(user),
        "User updated successfully"
      )
    } catch (err) {
      next(err)
    }
  }

  static async deactivateMe(req: Request, res: Response, next: NextFunction) {
    try {
      await UserController.userService.deactivateMe(req.user.id);
      sendSuccessResponse(
        res,
        HttpStatusCodes.OK,
        null,
        "User deleted successfully"
      )
    } catch (err) {
      next(err)
    }
  }
}