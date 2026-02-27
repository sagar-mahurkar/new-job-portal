export const APPLICATION_STATUSES = [
  "APPLIED",
  "SHORTLISTED",
  "REJECTED"
] as const;

export type ApplicationStatus = typeof APPLICATION_STATUSES[number]
