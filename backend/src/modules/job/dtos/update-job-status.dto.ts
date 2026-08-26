import { z } from "zod";
import { JOB_STATUSES } from "@/common/enums";

export const updateJobStatusSchema = z.object({
  status: z.enum(JOB_STATUSES),
}).strict();

export type UpdateJobStatusDto = z.infer<typeof updateJobStatusSchema>;