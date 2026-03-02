import { z } from "zod";
import { CANDIDATE_QUALIFICATIONS, COMPANY_SECTORS, EXPERIENCE_LEVELS } from "@/common/enums";
export const createJobSchema = z.object({
  title: z.string().min(3),
  
  description: z.string().min(10),
  
  minQualification: z.enum(CANDIDATE_QUALIFICATIONS),
  
  jobSector: z.enum(COMPANY_SECTORS),
  
  vacancies: z.int().positive(),

  location: z.string().min(1),

  experienceLevel: z.enum(EXPERIENCE_LEVELS)
}).strict();

export type CreateJobDto = z.infer<typeof createJobSchema>;
