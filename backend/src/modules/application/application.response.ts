import { Application } from "./application.entity"
import { mapJobToResponse } from "../job/job.response"
import { mapCandidateToResponse } from "../candidate/candidate.response"

export const mapApplicationToCandidateResponse = (application: Application) => ({
  id: application.id,
  jobPostingId: application.jobPostingId,
  status: application.status,
  appliedAt: application.createdAt,
  jobPosting: mapJobToResponse(application.jobPosting)
})

export const mapApplicationToRecruiterResponse = (application: Application) => ({
  id: application.id,
  candidate: application.candidate.user,
  jobPostingId: application.jobPostingId,
  status: application.status,
  appliedAt: application.createdAt,
  updatedAt: application.updatedAt,
  candidateProfile: mapCandidateToResponse(application.candidate)
})