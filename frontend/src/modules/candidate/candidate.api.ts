import { api } from "@/api/client";
import type { CandidateDashboardApplicationsResponse, CandidateDashboardSummaryResponse, CandidateProfile } from "./types/candidateTypes";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { UpdateCandidateProfileInputs } from "./schemas/candidateSchemas";

async function getDashboardSummary(): Promise<CandidateDashboardSummaryResponse> {
  const response = await api.get(API_ENDPOINTS.CANDIDATE_DASHBOARD);
  return response.data.data;
}

async function getDashboardApplications(): Promise<CandidateDashboardApplicationsResponse> {
  const response = await api.get(API_ENDPOINTS.CANDIDATE_DASHBOARD_APPLICATIONS);
  return response.data.data;
}

async function getMe(): Promise<CandidateProfile> {
  const response = await api.get(API_ENDPOINTS.CANDIDATE_ME);
  return response.data.data;
}

async function updateMe(
  payload: UpdateCandidateProfileInputs
): Promise<CandidateProfile> {
  const response = await api.patch(
    API_ENDPOINTS.CANDIDATE_ME,
    payload
  );
  return response.data.data;
}

export const candidateApi = {
  getDashboardSummary,
  getDashboardApplications,
  getMe,
  updateMe
};