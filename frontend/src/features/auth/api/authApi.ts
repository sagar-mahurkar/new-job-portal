import { api } from "@/api/axios";
import type { 
  SignupRequest, 
  SignupResponse, 
  LoginPasswordRequest,
  LoginPasswordResponse,
  RequestLoginOtpRequest,
  RequestLoginOtpResponse,
  VerifyLoginOtpRequest,
  VerifyLoginOtpResponse
} from "../types/authTypes";

// signupCandidate()
async function signupCandidate(
  payload: SignupRequest
): Promise<SignupResponse> {
  const response = await api.post(
    "/auth/signup/candidate",
    payload
  )
  return response.data;
}

// signupRecruiter()
async function signupRecruiter(
  payload: SignupRequest
): Promise<SignupResponse> {
  const response = await api.post(
    "/auth/signup/recruiter",
    payload
  )
  return response.data;
}

// loginWithPassword()
async function loginWithPassword(
  payload: LoginPasswordRequest
): Promise<LoginPasswordResponse> {

  const response = await api.post(
    "/auth/login/password",
    payload
  );

  return response.data;
}

// requestLoginOtp()
async function requestLoginOtp(
  payload: RequestLoginOtpRequest
): Promise<RequestLoginOtpResponse> {
  const response = await api.post(
    "/auth/login/otp/request",
    payload
  )

  return response.data;
}

// resendLoginOtp()
async function resendLoginOtp(
  payload: RequestLoginOtpRequest
): Promise<RequestLoginOtpResponse> {
  const response = await api.post(
    "/auth/login/otp/resend",
    payload
  )

  return response.data;
}

// verifyLoginOtp()
async function verifyLoginOtp(
  payload: VerifyLoginOtpRequest
): Promise<VerifyLoginOtpResponse> {
  const response = await api.post(
    "/auth/login/otp/verify",
    payload
  )

  return response.data;
}

export { 
  signupCandidate, 
  signupRecruiter, 
  loginWithPassword, 
  requestLoginOtp,
  resendLoginOtp,
  verifyLoginOtp
};
