import { Repository } from "typeorm";
import { JobPortalDataSource } from "@/config/database.config";
import { Job } from "../job/job.entity";
import { Application } from "../application/application.entity";

export const jobRepo: Repository<Job> = JobPortalDataSource.getRepository(Job);
export const applicationRepo: Repository<Application> = JobPortalDataSource.getRepository(Application);

export const recruiterDashboardRepository = {
  getRecruiterDashboardOverview: async (recruiterId: string) => {
    const [jobStats, appStats] = await Promise.all([
        jobRepo
          .createQueryBuilder("job")
          .select("COUNT(job.id)", "total")
          .addSelect("COUNT(job.id) FILTER (WHERE job.status = 'OPEN')", "open")
          .addSelect("COUNT(job.id) FILTER (WHERE job.status = 'CLOSED')", "closed")
          .where("job.recruiterId = :recruiterId", { recruiterId })
          .getRawOne(),

        applicationRepo
          .createQueryBuilder("application")
          .innerJoin("application.jobPosting", "job")
          .select("COUNT(application.id)", "total")
          .addSelect("COUNT(application.id) FILTER (WHERE application.status = 'APPLIED')", "applied")
          .addSelect("COUNT(application.id) FILTER (WHERE application.status = 'SHORTLISTED')", "shortlisted")
          .addSelect("COUNT(application.id) FILTER (WHERE application.status = 'REJECTED')", "rejected")
          .where("job.recruiterId = :recruiterId", { recruiterId })
          .getRawOne()
      ]);

    return { jobStats, appStats };
  },

  getRecruiterJobsDashboard: async (recruiterId: string, page: number, limit: number) => {
    const [total, rows]= await Promise.all([
      jobRepo.count({ where: { recruiterId }}),

      jobRepo.createQueryBuilder("job")
        .leftJoin("job.applications", "application")
        .select("job.id", "jobId")
        .addSelect("job.title", "title")
        .addSelect("job.status", "status")
        .addSelect("COUNT(application.id)", "applicantCount")
        .addSelect("COUNT(application.id) FILTER (WHERE application.status = 'APPLIED')", "applied")
        .addSelect("COUNT(application.id) FILTER (WHERE application.status = 'SHORTLISTED')", "shortlisted")
        .addSelect("COUNT(application.id) FILTER (WHERE application.status = 'REJECTED')", "rejected")
        .where("job.recruiterId = :recruiterId", { recruiterId })
        .groupBy("job.id")
        .addGroupBy("job.title")
        .addGroupBy("job.status")
        .orderBy("job.createdAt", "DESC")
        .limit(limit)
        .offset((page - 1) * limit)
        .getRawMany()
    ])

    return { rows, total }
  },

  getRecentApplications: async (
    recruiterId: string,
    limit: number = 5
  ) => {
    return applicationRepo
      .createQueryBuilder("application")
      .innerJoin("application.jobPosting", "job")
      .innerJoin("application.candidate", "candidate")
      .innerJoin("candidate.user", "user")
      .where("job.recruiterId = :recruiterId", { recruiterId })
      .select("application.id", "id")
      .addSelect("application.status", "status")
      .addSelect("application.createdAt", "appliedAt")
      .addSelect("job.id", "jobId")
      .addSelect("job.title", "jobTitle")
      .addSelect("user.name", "candidateName")
      .orderBy("application.createdAt", "DESC")
      .limit(limit)
      .getRawMany();
  }
}
