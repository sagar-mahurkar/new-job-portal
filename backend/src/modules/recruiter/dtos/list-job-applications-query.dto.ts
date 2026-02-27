import { z } from "zod";

export const listJobApplicationsQuerySchema = z.object({
  id: z.uuid(),
  pageSize: z.coerce.number().int().min(1).max(50).optional(),
  pageNumber: z.coerce.number().int().min(1).optional()
}).strict();

export type ListJobApplicationsQueryDto = z.infer<typeof listJobApplicationsQuerySchema>