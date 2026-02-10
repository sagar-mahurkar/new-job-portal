import { UpdateRecruiterProfileDto } from "./recruiter.dto";

export class RecruiterService {
  async getMyProfile(userId: string){
    // unauthorized access 403-FORBIDDEN
    // missing token 401-UNAUTHORIZED
  }

  async updateMyProfile(userId: string, dto: UpdateRecruiterProfileDto){
    // unauthorized access 403-FORBIDDEN
    // missing token 401-UNAUTHORIZED
  }

  async deleteMyProfile(userId: string){
    // unauthorized access 403-FORBIDDEN
    // missing token 401-UNAUTHORIZED
  }
}