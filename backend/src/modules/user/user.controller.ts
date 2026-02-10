import { Response, Request, NextFunction } from "express";
import { UserService } from "./user.service";
import { updateUserSchema } from "./user.dto";
import { sendSuccessResponse } from "@/common/utils/response.util";
import { HttpStatusCodes } from "@/common/constants/http.codes";
import { mapUserToResponse } from "./user.response";

export class UserController {

  private static userService = new UserService();

  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserController.userService.getUser(req.user.id);
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

  static async updateUser(req: Request, res:Response, next: NextFunction) {
    try {
      const dto = updateUserSchema.parse(req.body);
      const user = await UserController.userService.updateUser(req.user.id, dto);
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

  static async deactivateUser(req: Request, res: Response, next: NextFunction) {
    try {
      await UserController.userService.deactivateUser(req.user.id);
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