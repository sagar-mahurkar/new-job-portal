import { AppError } from "@/common/errors/AppError";
import { UpdateRecruiterProfileDto } from "./recruiter.dto";
import { recruiterRepository } from "./recruiter.repository";
import { HttpStatusCodes } from "@/common/constants/http.codes";

export class RecruiterService {
  async getMe(userId: string){
    const recruiter = await recruiterRepository.findOne({
      where: { userId }
    });

    if (!recruiter){
      throw new AppError("User not found", HttpStatusCodes.NOT_FOUND);
    };

    return recruiter;
  }

  async updateMe(userId: string, dto: UpdateRecruiterProfileDto){
    const recruiter = await recruiterRepository.findOne({
      where: { userId }
    });

    if (!recruiter){
      throw new AppError("Recruiter profile not found", HttpStatusCodes.NOT_FOUND);
    };

    Object.assign(recruiter, dto);

    await recruiterRepository.save(recruiter);

    return recruiter;
  }

  // soft delete -> user services
}