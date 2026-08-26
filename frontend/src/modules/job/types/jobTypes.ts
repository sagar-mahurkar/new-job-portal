import type { CompanySector, ExperienceLevel } from "@/shared/constants/enums";

export type JobFilters = {
  search?: string;
  sector?: CompanySector;
  location?: string;
  experienceLevel?: ExperienceLevel;
  page?: number;
  limit?: number;
};

export type PublicJob = {
  jobId: string;
  title: string;
  description: string;
  sector: string;
  minQualification: string;
  location: string;
  experienceLevel: string;
  companyName: string;
  postedOn: string;
};

export type PublicJobsResponse = {
  data: PublicJob[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};