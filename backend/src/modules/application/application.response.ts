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
  jobPostingId: application.jobPostingId,
  status: application.status,
  appliedAt: application.createdAt,
  candidateProfile: mapCandidateToResponse(application.candidate)
})