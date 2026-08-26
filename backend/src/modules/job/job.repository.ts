import { Repository } from "typeorm";
import { JobPortalDataSource } from "@/config/database.config";
import { Job } from "./job.entity";

export const repo: Repository<Job> = JobPortalDataSource.getRepository(Job);

export const jobRepository = {
  // create
  create: (data: Partial<Job>) => repo.create(data),

  // find
  findByRecruiterId: (recruiterId: string) => 
    repo.find({
      where: {
        recruiterId
      },
      relations: {
        applications: true
      }
    }),

  findOneByJobIdAndRecruiterId: (id: string, recruiterId: string) => 
    repo.findOne({
      where: {
        id,
        recruiterId
      }
    }),

  // findOne
  findOneByJobId: (id: string) => 
    repo.findOne({
      where: {
        id
      }
    }),

  findOneByIdAndRecruiterId: (id: string, recruiterId: string) => 
    repo.findOne({
      where: {
        id,
        recruiterId
      }
    }),


  // save
  save: (job: Job) => repo.save(job),

  // remove
  remove: (job: Job) => repo.remove(job),

  findIdsByRecruiterId: async (recruiterId: string) => {
    const jobs = await repo.find({
      where: { recruiterId },
      select: { id: true }
    });

    return jobs.map(job => job.id);
  },
    
  // increment
  incrementApplicantCount: (id: string, count: number) => 
      repo.increment({ id },
      "applicantCount",
      1
    )
}