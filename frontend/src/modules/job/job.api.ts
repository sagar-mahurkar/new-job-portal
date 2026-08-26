import { api } from "@/api/client";
import type { JobFilters, PublicJob, PublicJobsResponse } from "./types/jobTypes";


async function getAllJobs(filters: JobFilters = {}): Promise<PublicJobsResponse> {
  const response = await api.get("/jobs", {
    params: filters,
  });

  return response.data.data;
};

async function getOpenJobById(jobId: string): Promise<PublicJob> {
  const response = await api.get(`/jobs/${jobId}`);
  return response.data.data;
}

async function applyForJob(jobId: string): Promise<PublicJob> {
  const response = await api.post(`/applications/apply`, {
    jobPostingId: jobId
  });
  return response.data.data;
}

export const jobApi = {
  getAllJobs,
  getOpenJobById,
  applyForJob
}