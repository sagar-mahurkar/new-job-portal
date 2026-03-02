import { z } from "zod";

export const jobIdParamSchema = z.object({
  id: z.uuid(),
}).strict();

export type JobIdParamDto = z.infer<typeof jobIdParamSchema>;
