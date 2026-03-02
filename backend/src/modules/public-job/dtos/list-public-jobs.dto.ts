import { z } from "zod";
import { COMPANY_SECTORS, EXPERIENCE_LEVELS } from "@/common/enums";

export const listPublicJobsSchema = z.object({
  search: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  sector: z.enum(COMPANY_SECTORS).optional(),
  experienceLevel: z.enum(EXPERIENCE_LEVELS).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10)
}).strict();

export type ListPublicJobsDto = z.infer<typeof listPublicJobsSchema>;
