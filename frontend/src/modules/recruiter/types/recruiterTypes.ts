import type { ApplicationStatus, CandidateQualification, CompanySector, ExperienceLevel } from "@/shared/constants/enums";
export type RecruiterOverviewResponse = {
  jobs: {
    total: number;
    open: number;
    closed: number;
  };
  applications: {
    total: number;
    byStatus: {
      APPLIED: number;
      SHORTLISTED: number;
      REJECTED: number;
    };
  };
};

export type RecruiterJobDashboard = {
  jobId: string;
  title: string;
  status: string;
  applicantCount: number;
  applied: number;
  shortlisted: number;
  rejected: number;
};

export type RecruiterDashboardJobsResponse = {
  data: RecruiterJobDashboard[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type RecruiterProfile = {
  userId: string;
  companyName: string | null;
  companySector: CompanySector | null;
  description: string | null;
  jobPostings: unknown[];
};

export type RecruiterJob = {
  id: string;
  title: string;
  description: string;
  minQualification: CandidateQualification;
  jobSector: CompanySector;
  status: string;
  vacancies: number;
  applicantCount: number;
  applications: RecruiterApplication[];
  location: string;
  experienceLevel: ExperienceLevel;
  createdAt: string;
};

export type CreateJobInputs = {
  title: string;
  description: string;
  minQualification: CandidateQualification;
  jobSector: CompanySector;
  vacancies: number;
  location: string;
  experienceLevel: ExperienceLevel;
};

export type RecruiterApplication = {
  id: string;
  candidate: User;
  jobPostingId: string;
  status: ApplicationStatus;
  appliedAt: string;
  candidateProfile: CandidateProfile;
};

export type User = {
  name: string;
  email: string;
}

export type CandidateProfile = {
  userId: string;
  currentSector: CompanySector | null;
  experienceMonths: number | null;
  qualification: CandidateQualification | null;
  briefIntro: string | null;
  resumeUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  jobApplications: unknown[];
};

export type RecentApplication = {
  id: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  status: ApplicationStatus;
  appliedAt: string;
};