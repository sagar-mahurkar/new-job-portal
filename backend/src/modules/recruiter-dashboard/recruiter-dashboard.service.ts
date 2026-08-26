import { recruiterDashboardRepository } from "./recruiter-dashboard.repository";
import { QueryDashboardDto } from "./query-recruiter-dashboard.dto";

export class RecruiterDashboardService {
  async getRecruiterOverview(recruiterId: string) {
    const overview = await recruiterDashboardRepository.getRecruiterDashboardOverview(recruiterId);
    
    return overview;
  }

  async getRecruiterDashboard(recruiterId: string, dto:QueryDashboardDto ) {
    const { page, limit } = dto;
    
    const { rows, total } = await recruiterDashboardRepository.getRecruiterJobsDashboard(recruiterId, page, limit);

    const totalPages = Math.ceil(total / limit)
    
    return { rows, total, page, limit, totalPages }
  }

  async getRecentApplications(recruiterId: string, limit: number = 5) {
    return recruiterDashboardRepository.getRecentApplications(recruiterId, limit);
  }
}
