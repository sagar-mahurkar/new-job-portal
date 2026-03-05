import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
}).strict();

const loginPasswordSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
}).strict();

const otpRequestSchema = z.object({
  email: z.email("Invalid email address"),
}).strict();

const otpVerifySchema = z.object({
  email: z.email("Invalid email address"),
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits")
}).strict();

export { 
  signupSchema,
  loginPasswordSchema,
  otpRequestSchema,
  otpVerifySchema 
};
