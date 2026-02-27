import { CreateApplicationDto } from "./dtos/create-application.dto";
import { applicationRepository } from "./application.repository";
import { jobRepository } from "@/modules/job/job.repository";
import { AppError } from "@/common/errors/AppError";
import { HttpStatusCodes } from "@/common/constants/http.codes";

export class ApplicationService {
  // apply for a job
  async applyForJob(candidateId: string, dto: CreateApplicationDto){
    // find job
    const job = await jobRepository.findOneByJobId(dto.jobPostingId);

    if (!job) {
      throw new AppError("Job not found", HttpStatusCodes.NOT_FOUND);
    }

    if (job.status !== "OPEN"){
      throw new AppError("Job is closed", HttpStatusCodes.BAD_REQUEST);
    }

    // check for existing application
    const existing = await applicationRepository.findByCandidateAndJob(
      candidateId,
      dto.jobPostingId
    );

    if (existing) {
      throw new AppError("Already applied", HttpStatusCodes.CONFLICT);
    }

    // apply
    const application = await applicationRepository.create({
      candidateId,
      jobPostingId: dto.jobPostingId
    });

    await applicationRepository.save(application);

    // increase applicant count
    await jobRepository.incrementApplicantCount(dto.jobPostingId, 1);

    return application;
  }

  // get all job application
  async getAllApplicationsByCandidate(candidateId: string) {
    return applicationRepository.findByCandidate(candidateId);
  }
}
