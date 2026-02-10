import { AppError } from "@/common/errors/AppError";
import { UpdateRecruiterProfileDto } from "./recruiter.dto";
import { recruiterRepository } from "./recruiter.repository";
import { HttpStatusCodes } from "@/common/constants/http.codes";

export class RecruiterService {
  async getMyProfile(userId: string){
    const recruiter = await recruiterRepository.findOne({
      where: { userId }
    });

    if (!recruiter){
      throw new AppError("User not found", HttpStatusCodes.NOT_FOUND);
    };

    return recruiter;
  }

  async updateMyProfile(userId: string, dto: UpdateRecruiterProfileDto){
    const recruiter = await recruiterRepository.findOne({
      where: { userId }
    });

    if (!recruiter){
      throw new AppError("Recruiter profile not found", HttpStatusCodes.NOT_FOUND);
    };

    if (dto.companyName !== undefined){
      recruiter.companyName = dto.companyName;
    };

    if (dto.companySector !== undefined) {
      recruiter.companySector = dto.companySector;
    };

    if (dto.description !== undefined){
      recruiter.description = dto.description;
    };

    await recruiterRepository.save(recruiter);

    return recruiter;
  }

  // soft delete -> user services
}