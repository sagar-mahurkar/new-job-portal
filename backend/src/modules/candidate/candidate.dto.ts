import { z } from "zod";
import { CANDIDATE_QUALIFICATIONS, COMPANY_SECTORS } from "@/common/enums";

export const updateCandidateProfileSchema = z.object({
  // NO userId
  currentSector: z.enum(COMPANY_SECTORS).optional(),

  experienceMonths: z.number().int().nonnegative().optional(),

  qualification: z.enum(CANDIDATE_QUALIFICATIONS).optional(),

  briefIntro: z.string().min(10).max(500).optional(),

  resumeUrl: z.url().optional(),

  linkedinUrl: z.url().optional(),

  githubUrl: z.url().optional(),

  portfolioUrl: z.url().optional()
})
.strict()
.refine(data => Object.keys(data).length > 0);

export type UpdateCandidateProfileDto = z.infer<typeof updateCandidateProfileSchema>;
