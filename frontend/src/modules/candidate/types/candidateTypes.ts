import type { CandidateQualification, CompanySector } from "@/shared/constants/enums";

export type CandidateDashboardSummaryResponse = {
  totalApplications: number;
  byStatus: {
    APPLIED: number;
    SHORTLISTED: number;
    REJECTED: number;
  };
};

export type CandidateDashboardApplication = {
  jobId: string;
  companyName: string;
  title: string;
  status: string;
  appliedAt: string | null;
  updatedAt: string | null;
};

export type CandidateDashboardApplicationsResponse = {
  data: CandidateDashboardApplication[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type CandidateProfile = {
  userId: string;
  currentSector: CompanySector;
  experienceMonths: number;
  qualification: CandidateQualification;
  briefIntro: string;
  resumeUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  jobApplications: unknown[];
};