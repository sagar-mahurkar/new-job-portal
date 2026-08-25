// backend endpoint
export const API_ENDPOINTS = {
  HEALTH: "/health",
  LOGIN: "/auth/login/password",
  REQUEST_OTP: "/auth/login/otp/request",
  RESEND_OTP: "/auth/login/otp/resend",
  LOGIN_OTP: "/auth/login/otp/verify",
  SIGNUP_CANDIDATE: "/auth/signup/candidate",
  SIGNUP_RECRUITER: "/auth/signup/recruiter",
  CANDIDATE_ME: "/candidate/me",
  CANDIDATE_DASHBOARD: "/candidate/dashboard",
  CANDIDATE_DASHBOARD_APPLICATIONS: "/candidate/dashboard/applications",
  RECRUITER_ME: "/recruiter/me",
  RECRUITER_JOBS: "/recruiter/jobs",
  RECRUITER_JOBS_ME: "/recruiter/jobs/me",
  RECRUITER_DASHBOARD: "/recruiter/dashboard",
  RECRUITER_DASHBOARD_OVERVIEW: "/recruiter/dashboard/overview",
} as const;
