import { api } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  RecruiterOverviewResponse,
  RecruiterDashboardJobsResponse,
  RecruiterProfile,
  RecruiterJob,
  RecruiterApplication,
  RecentApplication,
} from "./types/recruiterTypes";
import type { CreateJobInputs, UpdateApplicationStatusInputs, UpdateJobInputs, UpdateRecruiterProfileInputs } from "./schemas/recruiterSchemas";

async function getMe(): Promise<RecruiterProfile> {
  const response = await api.get(API_ENDPOINTS.RECRUITER_ME);
  return response.data.data;
}

async function updateMe(
  payload: UpdateRecruiterProfileInputs
): Promise<RecruiterProfile> {
  const response = await api.patch(
    API_ENDPOINTS.RECRUITER_ME,
    payload
  );

  return response.data.data;
}

async function getMyJobs(): Promise<RecruiterJob[]> {
  const response = await api.get(API_ENDPOINTS.RECRUITER_JOBS_ME);
  return response.data.data;
}

async function createJob(
  payload: CreateJobInputs
): Promise<RecruiterJob> {
  const response = await api.post(
    API_ENDPOINTS.RECRUITER_JOBS,
    payload
  );

  return response.data.data;
}
async function updateJob(
  jobId: string,
  payload: UpdateJobInputs
): Promise<RecruiterJob> {
  const response = await api.patch(
    `/recruiter/jobs/${jobId}`,
    payload
  );

  return response.data.data;
}

async function deleteJob(jobId: string): Promise<void> {
  await api.delete(`/recruiter/jobs/${jobId}`);
}

async function getDashboardOverview(): Promise<RecruiterOverviewResponse> {
  const response = await api.get(
    API_ENDPOINTS.RECRUITER_DASHBOARD_OVERVIEW
  );

  return response.data.data;
}

async function getDashboardJobs(): Promise<RecruiterDashboardJobsResponse> {
  const response = await api.get(
    API_ENDPOINTS.RECRUITER_DASHBOARD
  );

  return response.data.data;
}

async function getJobById(jobId: string): Promise<RecruiterJob> {
  const response = await api.get(
    `/recruiter/jobs/${jobId}`
  );

  return response.data.data;
}

async function getJobApplications(
  jobId: string
): Promise<RecruiterApplication[]> {
  const response = await api.get(
    `/recruiter/jobs/${jobId}/applications`
  );

  return response.data.data.data;
}

async function updateApplciationStatus(applicationId: string, payload: UpdateApplicationStatusInputs): Promise<RecruiterApplication> {
  const response = await api.patch(
    `/recruiter/applications/${applicationId}/status`,
    payload
  );
  return response.data.data;
}

async function recentApplications(): Promise<RecentApplication[]> {
  const response = await api.get(
    `/recruiter/dashboard/recent-applications`,
  );
  return response.data.data.data;
}

async function updateJobStatus(jobId: string, status: "OPEN" | "CLOSED"): Promise<void> {
  await api.patch(
    `/recruiter/jobs/${jobId}/status`,
    { status }
  );
}

export const recruiterApi = {
  getMe,
  updateMe,
  getMyJobs,
  createJob,
  updateJob,
  deleteJob,
  getDashboardOverview,
  getDashboardJobs,
  getJobById,
  getJobApplications,
  recentApplications,
  updateApplciationStatus,
  updateJobStatus
};