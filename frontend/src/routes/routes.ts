export const ROUTES = {
  HOME: "/",

  JOB: {
    ROOT: "/jobs",
    PATHS: {
      DETAILS: ":jobId/details",
    },
    URLS: {
      DETAILS: "/jobs/:jobId/details",
    },
  },

  AUTH: {
    ROOT: "/auth",

    PATHS: {
      LOGIN: "login",
      REGISTER: "register",
      REQUEST_OTP: "request-otp",
      LOGIN_OTP: "login-otp",
    },

    URLS: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      REQUEST_OTP: "/auth/request-otp",
      LOGIN_OTP: "/auth/login-otp",
    },
  },

  CANDIDATE: {
    ROOT: "/candidate",

    PATHS: {
      DASHBOARD: "dashboard",
      PROFILE: "profile",
      APPLICATIONS: "applications",
    },

    URLS: {
      DASHBOARD: "/candidate/dashboard",
      PROFILE: "/candidate/profile",
      APPLICATIONS: "/candidate/applications",
    },
  },

  RECRUITER: {
    ROOT: "/recruiter",

    PATHS: {
      DASHBOARD: "dashboard",
      PROFILE: "profile",
      JOBS: "jobs",
      CREATE_JOB: "jobs/create",
      EDIT_JOB: "jobs/:jobId/edit",
      VIEW_APPLICATIONS: "jobs/:jobId/applications",
    },

    URLS: {
      DASHBOARD: "/recruiter/dashboard",
      PROFILE: "/recruiter/profile",
      JOBS: "/recruiter/jobs",
      CREATE_JOB: "/recruiter/jobs/create",
    },
  },
} as const;