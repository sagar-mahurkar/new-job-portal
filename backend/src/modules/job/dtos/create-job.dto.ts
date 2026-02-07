import { z } from "zod";
import { CANDIDATE_QUALIFICATIONS, COMPANY_SECTORS } from "@/common/enums";
export const createJobSchema = z.object({
  title: z.string().min(3),
  
  description: z.string().min(10),
  
  minQualification: z.enum(CANDIDATE_QUALIFICATIONS),
  
  jobSector: z.enum(COMPANY_SECTORS),
  
  vacancies: z.int().positive(),
});

export type CreateJobDto = z.infer<typeof createJobSchema>;
