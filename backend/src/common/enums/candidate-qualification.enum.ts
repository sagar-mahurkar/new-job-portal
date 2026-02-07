export const CANDIDATE_QUALIFICATIONS = [
  "GRADUATE",
  "POST_GRADUATE",
  "DOCTORATE"
] as const;

export type CandidateQualification =
  typeof CANDIDATE_QUALIFICATIONS[number];