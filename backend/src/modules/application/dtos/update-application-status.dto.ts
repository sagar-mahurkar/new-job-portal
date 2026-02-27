import { APPLICATION_STATUSES } from "@/common/enums";
import { z } from "zod";

export const updateApplicationStatusSchema = z.object({
  status: z.enum(APPLICATION_STATUSES)
}).strict();

export type UpdateApplicationStatusDto = z.infer<typeof updateApplicationStatusSchema>;
