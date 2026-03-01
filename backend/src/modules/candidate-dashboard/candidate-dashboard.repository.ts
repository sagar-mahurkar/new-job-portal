import { Repository } from "typeorm";
import { JobPortalDataSource } from "@/config/database.config";
import { Application } from "../application/application.entity";

export const applicationRepo: Repository<Application> = JobPortalDataSource.getRepository(Application);

export const candidateDashboardRepository = {
  getCandidateDashboardSummary: async (candidateId: string) => {
    return applicationRepo.createQueryBuilder("application")
      .select("COUNT(application.id)", "total")
      .addSelect("COUNT(application.id) FILTER(WHERE application.status = 'APPLIED')", "applied")
      .addSelect("COUNT(application.id) FILTER(WHERE application.status = 'SHORTLISTED')", "shortlisted")
      .addSelect("COUNT(application.id) FILTER(WHERE application.status = 'REJECTED')", "rejected")
      .where("application.candidateId = :candidateId", { candidateId })
      .getRawOne()
  },

  getCandidateDashboardApplications: async (
    candidateId: string, 
    page: number, 
    limit: number
  ) => {
    const [rows, total] = await Promise.all([
      applicationRepo.createQueryBuilder("application")
        .innerJoin("application.jobPosting", "job")
        .select("application.id", "id")
        .addSelect("application.status", "status")
        .addSelect("application.createdAt", "appliedAt")
        .addSelect("job.id", "jobId")
        .addSelect("job.title", "title")
        .where("application.candidateId = :candidateId", { candidateId })
        .orderBy("application.createdAt", "DESC")
        .limit(limit)
        .offset((page - 1) * limit)
        .getRawMany()
      ,

      applicationRepo.count({ where: { candidateId } })
    ])

    return { rows, total }
  }
}
