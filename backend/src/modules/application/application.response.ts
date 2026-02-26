import { Application } from "./application.entity"

export const mapApplicationToResponse = (application: Application) => ({
  id: application.id,
  jobPostingId: application.jobPostingId,
  status: application.status,
  appliedAt: application.createdAt
})