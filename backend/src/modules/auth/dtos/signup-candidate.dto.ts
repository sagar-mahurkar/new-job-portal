import { z } from "zod";

export const signupCandidateSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Invalid email").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignupCandidateDto = z.infer<typeof signupCandidateSchema>;
