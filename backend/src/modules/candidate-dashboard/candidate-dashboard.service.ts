import { candidateDashboardRepository } from "./candidate-dashboard.repository";
import { QueryDashboardDto } from "./query-candidate-dashboard.dto";

export class CandidateDashboardService {
  async getCandidateDashboardSummary(candidateId: string) {
    const summary = await candidateDashboardRepository.getCandidateDashboardSummary(candidateId);
    return summary;
  }

  async getCandidateDashboardApplications(candidateId: string, dto: QueryDashboardDto) {
    const { page, limit } = dto;
    
    const { rows, total } = await candidateDashboardRepository.getCandidateDashboardApplications(candidateId, page, limit);
    
    const totalPages = Math.ceil(total / limit)

    return { rows, total, page, limit, totalPages }
  }
}
