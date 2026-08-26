import { z } from "zod";
import { CANDIDATE_QUALIFICATIONS, COMPANY_SECTORS } from "@/common/enums";

const optionalUrl = z.url().or(z.literal(""));

export const updateCandidateProfileSchema = z.object({
  // NO userId
  currentSector: z.enum(COMPANY_SECTORS).optional(),

  experienceMonths: z.number().int().nonnegative().optional(),

  qualification: z.enum(CANDIDATE_QUALIFICATIONS).optional(),

  briefIntro: z.string().min(10).max(500).optional(),

  resumeUrl: optionalUrl,

  linkedinUrl: optionalUrl,

  githubUrl: optionalUrl,

  portfolioUrl: optionalUrl
})
.strict()
.refine(data => Object.keys(data).length > 0,
 { message: "At least one field must be provided" }
);

export type UpdateCandidateProfileDto = z.infer<typeof updateCandidateProfileSchema>;
