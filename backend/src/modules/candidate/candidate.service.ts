import { UpdateCandidateProfileDto } from "./candidate.dto";
import { candidateRepository } from "./candidate.repository";
import { AppError } from "@/common/errors/AppError";
import { HttpStatusCodes } from "@/common/constants/http.codes";

export class CandidateService {
  async getMe(userId: string){
    const candidate = await candidateRepository.findOne({
      where: { userId }
    });

    if (!candidate) {
      throw new AppError("Candidate profile not found", HttpStatusCodes.NOT_FOUND);
    }

    return candidate;
  }

  async updateMe(userId: string, dto: UpdateCandidateProfileDto){
    const candidate = await candidateRepository.findOne({
      where: { userId }
    });

    if (!candidate) {
      throw new AppError("Candidate profile not found", HttpStatusCodes.NOT_FOUND);
    };

    Object.assign(candidate, dto);

    await candidateRepository.save(candidate);

    return candidate;
  }

  // soft delete -> user services
}