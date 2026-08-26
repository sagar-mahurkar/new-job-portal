import { z } from "zod";
import { APPLICATION_STATUSES, CANDIDATE_QUALIFICATIONS, COMPANY_SECTORS, EXPERIENCE_LEVELS, JOB_STATUSES } from "@/shared/constants/enums";

export const updateRecruiterProfileSchema = z.object({
  companyName: z.string().min(3).optional(),
  companySector: z.enum(COMPANY_SECTORS).optional(),
  description: z.string().min(10).optional(),
}).strict().refine(
  data => Object.keys(data).length > 0,
  { message: "At least one field must be provided" }
);

export type UpdateRecruiterProfileInputs = z.infer<typeof updateRecruiterProfileSchema>;

export const createJobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  minQualification: z.enum(CANDIDATE_QUALIFICATIONS),
  jobSector: z.enum(COMPANY_SECTORS),
  vacancies: z.number().int().positive(),
  location: z.string().min(1),
  experienceLevel: z.enum(EXPERIENCE_LEVELS),
}).strict();

export type CreateJobInputs = z.infer<typeof createJobSchema>;

export const updateJobSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  minQualification: z.enum(CANDIDATE_QUALIFICATIONS).optional(),
  jobSector: z.enum(COMPANY_SECTORS).optional(),
  status: z.enum(JOB_STATUSES).optional(),
  vacancies: z.number().int().positive().optional(),
  location: z.string().min(1).optional(),
  experienceLevel: z.enum(EXPERIENCE_LEVELS).optional(),
}).strict().refine(
  data => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);

export type UpdateJobInputs = z.infer<typeof updateJobSchema>;

export const updateApplicationStatusSchema = z.object({
  status: z.enum(APPLICATION_STATUSES)
}).strict();

export type UpdateApplicationStatusInputs = z.infer<typeof updateApplicationStatusSchema>;