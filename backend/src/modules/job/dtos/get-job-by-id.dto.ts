import { z } from "zod";

export const getJobByIdSchema = z.object({
  id: z.uuid()
});

export type GetJobByIdDto = z.infer<typeof getJobByIdSchema>;
