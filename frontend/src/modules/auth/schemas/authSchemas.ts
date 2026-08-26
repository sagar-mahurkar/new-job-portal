import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email("Invalid email").toLowerCase(),
  password: z.string().trim().min(8, "Password must be at least 8 characters"),
  role: z.enum(["CANDIDATE", "RECRUITER"])
}).strict();

export const loginPasswordSchema = z.object({
  email: z.email("Invalid email").toLowerCase(),
  password: z.string().trim().min(8, "Password must be at least 8 characters")
}).strict();

export const requestOtpSchema = z.object({
  email: z.email("Invalid email").toLowerCase()
}).strict();

export const loginOtpSchema = z.object({
  email: z.email("Invalid email").toLowerCase(),
  loginOtp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
}).strict();