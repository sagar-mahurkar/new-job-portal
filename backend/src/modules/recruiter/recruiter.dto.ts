import { z } from "zod";

export const updateRecruiterProfileSchema = z.object({
  // NO userId
});

export type UpdateRecruiterProfileDto = z.infer<typeof updateRecruiterProfileSchema>;
