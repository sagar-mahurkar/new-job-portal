import { api } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { 
  LoginPasswordRequest, 
  LoginPasswordResponse,
  RequestLoginOtpRequest,
  RequestLoginOtpResponse,
  SignupRequest,
  SignupResponse,
  LoginOtpRequest,
  LoginOtpResponse
} from "./types/authTypes";


async function loginWithPassword(
  payload: LoginPasswordRequest
): Promise<LoginPasswordResponse> {
  const response = await api.post(
    API_ENDPOINTS.LOGIN,
    payload
  )
  console.log(response.data);
  return {
    token: response.data.data.accessToken, 
    user: response.data.data.user,
    message: response.data.message
  };
};

async function signup(
  payload: SignupRequest
): Promise<SignupResponse> {
  const endpoint = (payload.role === "CANDIDATE") ? API_ENDPOINTS.SIGNUP_CANDIDATE : API_ENDPOINTS.SIGNUP_RECRUITER
  const { role, ...requestBody } = payload;
  const response = await api.post<SignupResponse>(endpoint, requestBody)
  return response.data;
}

async function requestOtpFn(payload: RequestLoginOtpRequest): Promise<RequestLoginOtpResponse> {
  const response = await api.post(API_ENDPOINTS.REQUEST_OTP, payload)
  return {
    message: response.data.message
  }
}

async function loginWithOtpFn(payload: LoginOtpRequest): Promise<LoginOtpResponse> {
  const response = await api.post(API_ENDPOINTS.LOGIN_OTP, payload)
  return {
    token: response.data.data.accessToken,
    user: response.data.data.user,
    message: response.data.message
  }
}

export const authApi = { 
  loginWithPassword, 
  signup, 
  requestOtpFn, 
  loginWithOtpFn
}