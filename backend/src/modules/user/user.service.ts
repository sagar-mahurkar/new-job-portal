import { AppError } from "@/common/errors/AppError";
import { UpdateUserDto } from "./user.dto";
import { userRepository } from "./user.repository";
import { HttpStatusCodes } from "@/common/constants/http.codes";
import bcrypt from "bcrypt";

export class UserService {
  // get user
  async getMe(userId: string) {
    const user = await userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError("User not found", HttpStatusCodes.NOT_FOUND);
    };

    return user;
  }

  // update name
  async updateMe(userId: string, dto: UpdateUserDto) {
    const user = await userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError("User not found", HttpStatusCodes.NOT_FOUND);
    };

    if (dto.name !== undefined) {
      user.name = dto.name;
    }
    if (dto.email !== undefined) {
      user.email = dto.email;
    }
    if (dto.password !== undefined) {
      user.password = await this.hashPassword(dto.password);
    }

    await userRepository.save(user);

    return user;
  }

  // soft delete
  async deactivateMe(userId: string) {
    const user = await userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError("User not found", HttpStatusCodes.NOT_FOUND);
    };

    if (!user.isActive) {
      return;
    }

    user.isActive = false;
    await userRepository.save(user)

    return;
  }
  
  // helper functions
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}