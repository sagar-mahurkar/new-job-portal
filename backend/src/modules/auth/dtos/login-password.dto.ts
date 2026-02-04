import { z } from "zod";

export const loginPasswordSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().trim().min(1),
});

export type LoginPasswordDto = z.infer<typeof loginPasswordSchema>;
