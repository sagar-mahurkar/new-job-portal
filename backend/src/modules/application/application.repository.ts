import { Repository } from "typeorm";
import { JobPortalDataSource } from "@/config/database.config";
import { Application } from "./application.entity";
import { In } from "typeorm";

const repo: Repository<Application> = JobPortalDataSource.getRepository(Application);

export const applicationRepository = {
  create: (data: Partial<Application>) => repo.create(data),

  save: (application: Application) => repo.save(application),

  findByCandidateAndJob: (candidateId: string, jobPostingId: string) =>
    repo.findOne({
      where: { candidateId, jobPostingId }
    }),

  findByCandidate: (candidateId: string) =>
    repo.find({
      where: { candidateId },
      relations: { jobPosting: true }
    }),

  findByJobPosting: async (
    jobPostingId: string, 
    page: number, 
    limit: number
  ) => {
    const [data, total] = await repo.findAndCount({
      where: { jobPostingId },
      relations: { 
        candidate: {
          user: true
        } 
      },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" }
    });
    return { data, total };
  },

  findById: (id: string) => 
    repo.findOne({
      where: { id },
      relations: { jobPosting: true, candidate: true }
    })
};