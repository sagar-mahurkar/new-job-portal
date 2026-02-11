import { AppError } from "@/common/errors/AppError";
import { CreateJobDto, GetMyJobsDto, UpdateJobDto } from "./dtos";
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
  async getJobById(recruiterId: string, jobId: string) {
    const job = await jobRepository.findOne({
      where: { id: jobId, recruiterId }
    });

    if (!job) {
      throw new AppError("Job not found", HttpStatusCodes.NOT_FOUND)
    };

    return job;
  }

  // updateJobById
  async updateJob(recruiterId: string, jobId: string, dto: UpdateJobDto) {
    const job = await jobRepository.findOne({
      where: { id: jobId, recruiterId}
    });

    if (!job) {
      throw new AppError("Job not found", HttpStatusCodes.NOT_FOUND);
    };

    // update
    Object.assign(job, dto);

    // preserve update
    await jobRepository.save(job);

    return job;
  }

  // delete job
  async deleteJob(recruiterId: string, jobId: string){
    const job = await jobRepository.findOne({
      where: { id: jobId, recruiterId }
    });

    if (!job) {
      throw new AppError("Job not found", HttpStatusCodes.NOT_FOUND)
    };

    await jobRepository.remove(job);

    return;
  }
}
