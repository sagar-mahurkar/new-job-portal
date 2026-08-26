export const COMPANY_SECTORS = [
  "IT",
  "FINANCE",
  "HEALTHCARE",
  "EDUCATION",
  "MANUFACTURING"
] as const;

export type CompanySector = typeof COMPANY_SECTORS[number];

export const CANDIDATE_QUALIFICATIONS = [
  "GRADUATE",
  "POST_GRADUATE",
  "DOCTORATE"
] as const;

export type CandidateQualification = typeof CANDIDATE_QUALIFICATIONS[number];

export const EXPERIENCE_LEVELS = [
  "JUNIOR",
  "MID",
  "SENIOR"
] as const;

export type ExperienceLevel = typeof EXPERIENCE_LEVELS[number];

export const JOB_STATUSES = [
  "OPEN",
  "CLOSED"
] as const;

export type JobStatus = typeof JOB_STATUSES[number];

export const APPLICATION_STATUSES = [
  "APPLIED",
  "SHORTLISTED",
  "REJECTED"
] as const;

export type ApplicationStatus = typeof APPLICATION_STATUSES[number];