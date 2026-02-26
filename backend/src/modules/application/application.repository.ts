import { Repository } from "typeorm";
import { JobPortalDataSource } from "@/config/database.config";
import { Application } from "./application.entity";

const repo = JobPortalDataSource.getRepository(Application);

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
    })
};