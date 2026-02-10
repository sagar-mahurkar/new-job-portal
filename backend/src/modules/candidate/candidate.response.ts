import { Candidate } from "./candidate.entity";

export const mapCandidateToResponse = (candidate: Candidate) => ({
  userId: candidate.userId,
  currentSector: candidate.currentSector,
  experienceMonths: candidate.experienceMonths,
  qualification: candidate.qualification,
  briefIntro: candidate.briefIntro,
  resumeUrl: candidate.resumeUrl,
  linkedinUrl: candidate.linkedinUrl,
  githubUrl: candidate.githubUrl,
  portfolioUrl: candidate.portfolioUrl,
  // jobApplications: candidate.jobApplications
})