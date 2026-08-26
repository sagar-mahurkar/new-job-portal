import { z } from "zod";
import type { User } from "@/shared/types/user";
import { 
  loginOtpSchema, 
  loginPasswordSchema, 
  requestOtpSchema, 
  signupSchema 
} from "@/modules/auth/schemas/authSchemas";

export type SignupRequest = z.infer<typeof signupSchema>;

export type SignupResponse = {
  message: string;
};

export type LoginPasswordRequest = z.infer<typeof loginPasswordSchema>;

export type LoginPasswordResponse = {
  token: string;
  user: User;
  message: string;
};

export type RequestLoginOtpRequest = z.infer<typeof requestOtpSchema>;

export type RequestLoginOtpResponse = {
  message: string;
};

export type LoginOtpRequest = z.infer<typeof loginOtpSchema>;

export type LoginOtpResponse = {
  token: string;
  user: User;
  message: string;
};