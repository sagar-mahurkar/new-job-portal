export const JOB_STATUSES = [
  "OPEN",
  "CLOSED"
] as const;

export type JobStatus = 
  typeof JOB_STATUSES[number]