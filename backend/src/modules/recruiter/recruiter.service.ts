import { AppError } from "@/common/errors/AppError";
import { UpdateRecruiterProfileDto,ListJobApplicationsQueryDto } from "./dtos";
import { recruiterRepository } from "./recruiter.repository";
import { HttpStatusCodes } from "@/common/constants/http.codes";
import { jobRepository } from "@/modules/job/job.repository";
import { applicationRepository } from "@/modules/application/application.repository";
import { UpdateApplicationStatusDto } from "@/modules/application/dtos";
import { isValidTransition } from "@/modules/application/application.lifecycle";
import { UpdateJobStatusDto } from "../job/dtos/update-job-status.dto";
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

  async getApplicationsByJob(recruiterId: string, dto: ListJobApplicationsQueryDto) {
    const job = await jobRepository.findOneByIdAndRecruiterId(dto.id, recruiterId);
    const page = dto.pageNumber ?? 1;
    const size = dto.pageSize ?? 10;
    if (!job) {
      throw new AppError("Job not found", HttpStatusCodes.NOT_FOUND)
    };
    
    const { data, total} = await applicationRepository.findByJobPosting(job.id, page, size);

    return {
      data,
      meta: {
        total,
        page,
        limit: size,
        totalPages: Math.ceil(total / size)
      }
    };
  }

  async updateApplicationStatus(recruiterId: string, applicationId: string, dto: UpdateApplicationStatusDto) {
    const application = await applicationRepository.findById(applicationId);

    if (!application) {
      throw new AppError(
        "Application not found",
        HttpStatusCodes.NOT_FOUND
      );
    }

    const job = await jobRepository.findOneByJobId(application.jobPostingId);

    if (!job) {
      throw new AppError(
        "Job not found",
        HttpStatusCodes.NOT_FOUND
      );
    }

    if (job.recruiterId !== recruiterId) {
      throw new AppError("Application not found", HttpStatusCodes.NOT_FOUND);
    }
    if (!isValidTransition(application.status, dto.status)) {
      throw new AppError("Transition is not possible", HttpStatusCodes.BAD_REQUEST);
    }
    application.status = dto.status;
    await applicationRepository.save(application);
    return application;
  }

  async updateJobStatus(recruiterId: string, jobId: string, dto: UpdateJobStatusDto) {
    const job = await jobRepository.findOneByJobIdAndRecruiterId(jobId, recruiterId);

    if (!job) {
      throw new AppError("Job not found", HttpStatusCodes.NOT_FOUND)
    };

    job.status = dto.status;
    await jobRepository.save(job);
    return job;
  }
}
