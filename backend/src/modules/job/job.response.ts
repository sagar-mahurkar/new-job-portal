import { Job } from "./job.entity";

export const mapJobToResponse = (job: Job) => ({
  id: job.id,
  title: job.title,
  description: job.description,
  minQualification: job.minQualification,
  jobSector: job.jobSector,
  status: job.status,
  vacancies: job.vacancies,
  applicantCount: job.applicantCount,
  createdAt: job.createdAt,
})