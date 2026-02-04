import { z } from "zod";

export const requestOtpSchema = z.object({
  email: z.email("Invalid email").toLowerCase(),
});

export type RequestOtpDto = z.infer<typeof requestOtpSchema>;