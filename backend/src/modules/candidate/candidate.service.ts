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

    if (dto.qualification !== undefined) {
      candidate.qualification = dto.qualification;
    };

    if (dto.briefIntro !== undefined){
      candidate.briefIntro = dto.briefIntro;
    };

    if (dto.resumeUrl !== undefined) {
      candidate.resumeUrl = dto.resumeUrl;
    };

    if (dto.experienceMonths !== undefined) {
      candidate.experienceMonths = dto.experienceMonths;
    };

    if (dto.currentSector !== undefined) {
      candidate.currentSector = dto.currentSector;
    };

    if (dto.linkedinUrl !== undefined) {
      candidate.linkedinUrl = dto.linkedinUrl;
    };

    if (dto.githubUrl !== undefined) {
      candidate.githubUrl = dto.githubUrl;
    };

    if (dto.portfolioUrl !== undefined) {
      candidate.portfolioUrl = dto.portfolioUrl;
    };

    await candidateRepository.save(candidate);

    return candidate;
  }

  // soft delete -> user services
}