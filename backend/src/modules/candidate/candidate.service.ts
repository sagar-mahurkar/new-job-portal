import { UpdateCandidateProfileDto } from "./candidate.dto";

export class CandidateService {
  async getMyProfile(userId: string){
    // unauthorized access 403-FORBIDDEN
    // missing token 401-UNAUTHORIZED
  }

  async updateMyProfile(userId: string, dto: UpdateCandidateProfileDto){
    // unauthorized access 403-FORBIDDEN
    // missing token 401-UNAUTHORIZED
  }

  async deleteMyProfile(userId: string){
    // unauthorized access 403-FORBIDDEN
    // missing token 401-UNAUTHORIZED
  }
}