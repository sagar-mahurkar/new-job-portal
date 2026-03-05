import { Route } from "react-router-dom";
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { SignupCandidatePage } from "@/features/auth/pages/SignupCandidatePage";
import { SignupRecruiterPage } from "@/features/auth/pages/SignupRecruiterPage";
import { OtpRequestPage } from "@/features/auth/pages/OtpRequestPage";
import { OtpVerifyPage } from "@/features/auth/pages/OtpVerifyPage";
import { JobListPage } from "@/features/jobs/pages/JobListPage";
import { JobDetailPage } from "@/features/jobs/pages/JobDetailPage";

function PublicRoutes() {
  return (
    <>
      <Route path="/login/password" element={<LoginPage />} />
      <Route path="/signup/candidate" element={<SignupCandidatePage />} />
      <Route path="/signup/recruiter" element={<SignupRecruiterPage />} />
      <Route path="/login/otp/request" element={<OtpRequestPage />} />
      <Route path="/login/otp/verify" element={<OtpVerifyPage />} />
      <Route path="/jobs" element={<JobListPage />} />
      <Route path="/jobs/:id" element={<JobDetailPage />} />
    </>
  )
};

export { PublicRoutes };
