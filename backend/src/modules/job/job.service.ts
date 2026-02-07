import { AppError } from "@/common/errors/AppError";
import { CreateJobDto, GetJobByIdDto, GetMyJobsDto } from "./dtos";
import { jobRepository } from "./job.repository";
import { HttpStatusCodes } from "@/common/constants/http.codes";

export class JobService {
  // createJob
  async createJob(recruiterId: string, dto: CreateJobDto) {
    const job = jobRepository.create({
      title: dto.title,
      description: dto.description,
      minQualification: dto.minQualification,
      jobSector: dto.jobSector,
      vacancies: dto.vacancies,
      recruiterId,
    });

    await jobRepository.save(job);

    return job;
  }

  // getMyJobs
  async getMyJobs(recruiterId: string, dto: GetMyJobsDto) {
    const jobs = await jobRepository.find({
      where: { recruiterId }
    });

    return jobs;
  }

  // getJobById
  async getJobById(recruiterId: string, dto: GetJobByIdDto) {
    const job = await jobRepository.findOne({
      where: { id: dto.id, recruiterId }
    });

    if (!job) {
      throw new AppError("Job not found", HttpStatusCodes.NOT_FOUND)
    }

    return job;
  }

}
