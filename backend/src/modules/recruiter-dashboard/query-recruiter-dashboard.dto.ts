import { z } from "zod";

export const queryDashboardSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10)
}).strict();

export type QueryDashboardDto = z.infer<typeof queryDashboardSchema>
