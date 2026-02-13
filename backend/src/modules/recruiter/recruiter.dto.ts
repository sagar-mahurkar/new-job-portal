import { z } from "zod";
import { COMPANY_SECTORS } from "@/common/enums";

export const updateRecruiterProfileSchema = z.object({
  // NO userId
  companyName: z.string().min(3).optional(),

  companySector: z.enum(COMPANY_SECTORS).optional(),

  description: z.string().min(10).optional()
})
.strict()
.refine(data => Object.keys(data).length > 0);

export type UpdateRecruiterProfileDto = z.infer<typeof updateRecruiterProfileSchema>;
