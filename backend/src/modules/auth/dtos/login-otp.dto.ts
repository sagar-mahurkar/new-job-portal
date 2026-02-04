import { z } from "zod";

export const loginOtpSchema = z.object({
  email: z.email().toLowerCase(),
  loginOtp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export type LoginOtpDto = z.infer<typeof loginOtpSchema>;
