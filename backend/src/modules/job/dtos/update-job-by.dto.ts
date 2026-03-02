import { z } from "zod";
import { CANDIDATE_QUALIFICATIONS, COMPANY_SECTORS, JOB_STATUSES, EXPERIENCE_LEVELS } from "@/common/enums";

export const updateJobSchema = z.object({

  title: z.string().min(3).optional(),

  description: z.string().min(10).optional(),

  minQualification: z.enum(CANDIDATE_QUALIFICATIONS).optional(),

  jobSector: z.enum(COMPANY_SECTORS).optional(),

  status: z.enum(JOB_STATUSES).optional(),

  vacancies: z.int().positive().optional(),

  location: z.string().min(1).optional(),

  experienceLevel: z.enum(EXPERIENCE_LEVELS).optional(),
})
.strict()
.refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
});

export type UpdateJobDto = z.infer<typeof updateJobSchema>;