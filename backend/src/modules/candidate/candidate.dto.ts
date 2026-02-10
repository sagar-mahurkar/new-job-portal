import { z } from "zod";

export const updateCandidateProfileSchema = z.object({
  // NO userId
});

export type UpdateCandidateProfileDto = z.infer<typeof updateCandidateProfileSchema>;
