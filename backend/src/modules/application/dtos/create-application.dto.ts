import { z } from "zod";

export const createApplicationSchema = z.object({
  jobPostingId: z.uuid()
}).strict();

export type CreateApplicationDto = z.infer<typeof createApplicationSchema>;