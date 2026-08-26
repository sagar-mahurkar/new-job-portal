import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AuthRedirect from "@/shared/components/AuthRedirect";
import ErrorPage from "@/pages/ErrorPage";
import LoginPage from "@/modules/auth/pages/LoginPage";
import RequestOTPPage from "@/modules/auth/pages/RequestOTPPage";
import LoginOTPPage from "@/modules/auth/pages/LoginOTPPage";
import RegisterPage from "@/modules/auth/pages/RegisterPage";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import RoleGuard from "@/shared/components/RoleGuard";
import { ROUTES } from "./routes";
import CandidateDashboardPage from "@/modules/candidate/pages/CandidateDashboardPage";
import CandidateProfilePage from "@/modules/candidate/pages/CandidateProfilePage";
import CandidateApplicationsPage from "@/modules/candidate/pages/CandidateApplicationsPage";
import RecruiterDashboardPage from "@/modules/recruiter/pages/RecruiterDashboardPage";
import RecruiterJobsPage from "@/modules/recruiter/pages/RecruiterJobsPage";
import RecruiterProfilePage from "@/modules/recruiter/pages/RecruiterProfilePage";
import RecruiterApplicationsPage from "@/modules/recruiter/pages/RecruiterApplicationsPage";
import JobDetailsPage from "@/modules/job/pages/JobDetailsPage";

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout />
    ),
    children: [
      { index: true, element: <HomePage /> },

      {
        path: ROUTES.JOB.ROOT,
        children: [
          { 
            path: ROUTES.JOB.PATHS.DETAILS,
            element: <JobDetailsPage />,
          }
        ]
      },

      {
        element: <ProtectedRoute />,
        children: [
          // protected routes will go here
          {
            path: ROUTES.CANDIDATE.ROOT,
            element: <RoleGuard allowedRoles={["CANDIDATE"]} />,
            children: [
              // candidate routes will go here
              {
                path: ROUTES.CANDIDATE.PATHS.DASHBOARD,
                element: <CandidateDashboardPage />,
              },
              {
                path: ROUTES.CANDIDATE.PATHS.PROFILE,
                element: <CandidateProfilePage />,
              },
              {
                path: ROUTES.CANDIDATE.PATHS.APPLICATIONS,
                element: <CandidateApplicationsPage />,
              },
            ],
          },
          {
            path: ROUTES.RECRUITER.ROOT,
            element: <RoleGuard allowedRoles={["RECRUITER"]} />,
            children: [
              // recruiter routes will go here
              {
                path: ROUTES.RECRUITER.PATHS.DASHBOARD,
                element: <RecruiterDashboardPage />,
              },
              {
                path: ROUTES.RECRUITER.PATHS.JOBS,
                element: <RecruiterJobsPage />,
              },
              {
                path: ROUTES.RECRUITER.PATHS.PROFILE,
                element: <RecruiterProfilePage />,
              },
              {
                path: ROUTES.RECRUITER.PATHS.VIEW_APPLICATIONS,
                element: <RecruiterApplicationsPage />
              }
            ],
          },
        ],
      },
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        element: <AuthRedirect />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "request-otp", element: <RequestOTPPage /> },
          { path: "login-otp", element: <LoginOTPPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },
    ],
  },

  {
    path: '*',
    element: <ErrorPage />,
  },
]);

export { router };
