import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.email("Invalid email").toLowerCase().optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional()
}).strict();

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
