import { AppError } from "@/common/errors/AppError";
import { UpdateRecruiterProfileDto,ListJobApplicationsQueryDto } from "./dtos";
import { recruiterRepository } from "./recruiter.repository";
import { HttpStatusCodes } from "@/common/constants/http.codes";
import { jobRepository } from "../job/job.repository";
import { applicationRepository } from "../application/application.repository";
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
    const job = await jobRepository.findOneByIdAndRecruiterId(dto.jobId, recruiterId);
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
}
