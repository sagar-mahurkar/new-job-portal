import { Recruiter } from "./recruiter.entity";

export const mapRecruiterToResponse = (recruiter: Recruiter) => ({
  userId: recruiter.userId,
  companyName: recruiter.companyName,
  companySector: recruiter.companySector,
  description: recruiter.description,
  jobPostings: recruiter.jobPostings
})