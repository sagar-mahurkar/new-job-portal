import { z } from "zod";

export const getApplicationSchema = z.object({
  id: z.uuid()
}).strict();

export type GetApplicationDto = z.infer<typeof getApplicationSchema>;