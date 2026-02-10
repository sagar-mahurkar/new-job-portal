import { Request, Response, NextFunction } from "express";

export class CandidateController {
  static async getMyProfile(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.id; // ONLY source of truth
    throw new Error("Not implemented");
  }

  static async updateMyProfile(req: Request, res: Response, next: NextFunction) {
    throw new Error("Not implemented");
  }

  static async deleteMyProfile(req: Request, res: Response, next: NextFunction) {
    throw new Error("Not implemented");
  }
}