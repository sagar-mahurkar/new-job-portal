import { z } from "zod";

export const requestOtpSchema = z.object({
  email: z.email("Invalid email").toLowerCase(),
})
.strict();

export type RequestOtpDto = z.infer<typeof requestOtpSchema>;